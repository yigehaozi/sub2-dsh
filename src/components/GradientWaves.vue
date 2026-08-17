<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->
<template>
  <div
    ref="root"
    class="gradient-waves"
    :class="[props.className, { 'gradient-waves--fallback': fallback }]"
    :style="containerStyle"
  >
    <canvas ref="canvas" class="gradient-waves__canvas" aria-hidden="true" />
    <div class="gradient-waves__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface GradientWavesProps {
  horizonColor?: string
  waveColor?: string
  crestColor?: string
  speed?: number
  amplitude?: number
  waveScale?: number
  waveRatio?: number
  swell?: number
  turbulence?: number
  tilt?: number
  zoom?: number
  height?: string | number
  fogDepth?: number
  detail?: 'low' | 'medium' | 'high' | number
  brightness?: number
  opacity?: number
  mouseInteraction?: boolean
  parallaxStrength?: number
  grain?: boolean
  grainIntensity?: number
  className?: string
}

const props = withDefaults(defineProps<GradientWavesProps>(), {
  // DeepSeek's blue palette keeps the fallback useful before WebGL is ready.
  horizonColor: '#061329',
  waveColor: '#0b4f8a',
  crestColor: '#68bdf4',
  speed: 0.4,
  amplitude: 2.5,
  waveScale: 0.6,
  waveRatio: 0.9,
  swell: 35,
  turbulence: 20,
  tilt: 1.11,
  zoom: 1,
  height: 5.5,
  fogDepth: 15,
  detail: 'medium',
  brightness: 1,
  opacity: 1,
  mouseInteraction: true,
  parallaxStrength: 0.5,
  grain: true,
  grainIntensity: 0.05,
})

const root = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const fallback = ref(false)
const reducedMotion = ref(false)

let gl: WebGL2RenderingContext | null = null
let program: WebGLProgram | null = null
let buffer: WebGLBuffer | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let mediaQuery: MediaQueryList | null = null
let animationFrame = 0
let pageVisible = true
let inViewport = true
let mounted = false
let time = 0
let lastFrame = 0

const pointer = { x: 0.5, y: 0.5 }
const pointerTarget = { x: 0.5, y: 0.5 }
const uniform = new Map<string, WebGLUniformLocation | null>()

const containerStyle = computed(() => ({
  '--gradient-waves-horizon': props.horizonColor,
  '--gradient-waves-wave': props.waveColor,
  '--gradient-waves-crest': props.crestColor,
  '--gradient-waves-opacity': String(Math.max(0, Math.min(1, props.opacity))),
  height: normalizeHeight(props.height),
}))

function normalizeHeight(value: string | number): string {
  return typeof value === 'number' ? '100%' : value
}

function detailToSteps(value: GradientWavesProps['detail']): number {
  if (value === 'low') return 40
  if (value === 'high') return 110
  if (value === 'medium' || value === undefined) return 70
  return Math.max(1, Math.min(128, value))
}

function shaderHeight(value: GradientWavesProps['height']): number {
  return typeof value === 'number' ? value : 5.5
}

function parseColor(value: string): [number, number, number] {
  const input = value.trim().toLowerCase()
  const hex = input.match(/^#([0-9a-f]{3,8})$/i)
  if (hex) {
    const raw = hex[1]
    if (raw.length === 3 || raw.length === 4) {
      return [
        parseInt(`${raw[0]}${raw[0]}`, 16) / 255,
        parseInt(`${raw[1]}${raw[1]}`, 16) / 255,
        parseInt(`${raw[2]}${raw[2]}`, 16) / 255,
      ]
    }
    if (raw.length >= 6) {
      return [
        parseInt(raw.slice(0, 2), 16) / 255,
        parseInt(raw.slice(2, 4), 16) / 255,
        parseInt(raw.slice(4, 6), 16) / 255,
      ]
    }
  }

  const rgb = input.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/)
  if (rgb) {
    return [Number(rgb[1]) / 255, Number(rgb[2]) / 255, Number(rgb[3]) / 255]
  }

  // CSS named colors are uncommon for this component. Keep shader compilation
  // deterministic when a custom value cannot be parsed.
  return [0.024, 0.075, 0.161]
}

const vertexSource = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const fragmentSource = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform float uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float t = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(t / 0.130, t / 0.810, t / 0.200, t / 0.710);
  float c;
  float s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot);
  s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x;
  s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt);
  s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse > 0.5) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw);
    s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch);
    s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;
  float fog = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 color = mix(uHorizonColor, body, fog) * uBrightness;
  color = clamp(color, 0.0, 1.0);
  float alpha = clamp(fog, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(color * alpha, alpha);
}`

function compileShader(type: number, source: string): WebGLShader | null {
  if (!gl) return null
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(): WebGLProgram | null {
  if (!gl) return null
  const vertex = compileShader(gl.VERTEX_SHADER, vertexSource)
  const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentSource)
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex)
    if (fragment) gl.deleteShader(fragment)
    return null
  }
  const nextProgram = gl.createProgram()
  if (!nextProgram) {
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    return null
  }
  gl.attachShader(nextProgram, vertex)
  gl.attachShader(nextProgram, fragment)
  gl.bindAttribLocation(nextProgram, 0, 'aPosition')
  gl.linkProgram(nextProgram)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(nextProgram, gl.LINK_STATUS)) {
    gl.deleteProgram(nextProgram)
    return null
  }
  return nextProgram
}

function setUniform(name: string, value: number | number[]): void {
  if (!gl || !program) return
  const location = uniform.get(name)
  if (location === undefined || location === null) return
  if (Array.isArray(value)) {
    if (value.length === 2) gl.uniform2f(location, value[0], value[1])
    else if (value.length === 3) gl.uniform3f(location, value[0], value[1], value[2])
  } else {
    gl.uniform1f(location, value)
  }
}

function updateUniforms(): void {
  if (!gl || !program || !canvas.value) return
  setUniform('iResolution', [canvas.value.width, canvas.value.height])
  setUniform('iTime', time)
  setUniform('uSpeed', props.speed)
  setUniform('uAmplitude', props.amplitude)
  setUniform('uWaveScale', props.waveScale)
  setUniform('uWaveRatio', props.waveRatio)
  setUniform('uSwell', props.swell)
  setUniform('uTurbulence', props.turbulence)
  setUniform('uTilt', props.tilt)
  setUniform('uZoom', props.zoom)
  setUniform('uHeight', shaderHeight(props.height))
  setUniform('uFogDepth', props.fogDepth)
  setUniform('uSteps', detailToSteps(props.detail))
  setUniform('uBrightness', props.brightness)
  setUniform('uOpacity', Math.max(0, Math.min(1, props.opacity)))
  setUniform('uParallax', props.parallaxStrength)
  setUniform('uEnableMouse', props.mouseInteraction ? 1 : 0)
  setUniform('uGrain', props.grain ? 1 : 0)
  setUniform('uGrainIntensity', props.grainIntensity)
  setUniform('uMouse', [pointer.x, pointer.y])
  setUniform('uHorizonColor', parseColor(props.horizonColor))
  setUniform('uWaveColor', parseColor(props.waveColor))
  setUniform('uCrestColor', parseColor(props.crestColor))
}

function drawFrame(): void {
  if (!gl || !program || !buffer) return
  gl.useProgram(program)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  updateUniforms()
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

function resize(): void {
  if (!canvas.value || !gl || !root.value) return
  const rect = root.value.getBoundingClientRect()
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  const width = Math.max(1, Math.round(rect.width * ratio))
  const height = Math.max(1, Math.round(rect.height * ratio))
  if (canvas.value.width !== width || canvas.value.height !== height) {
    canvas.value.width = width
    canvas.value.height = height
    gl.viewport(0, 0, width, height)
  }
  drawFrame()
}

function canAnimate(): boolean {
  return mounted && pageVisible && inViewport && !reducedMotion.value && props.speed !== 0
}

function cancelAnimation(): void {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  animationFrame = 0
}

function tick(timestamp: number): void {
  if (!gl || !program) return
  const elapsed = lastFrame ? Math.min(100, timestamp - lastFrame) : 16.67
  lastFrame = timestamp
  if (canAnimate()) time += elapsed / 1000
  pointer.x += (pointerTarget.x - pointer.x) * 0.08
  pointer.y += (pointerTarget.y - pointer.y) * 0.08
  drawFrame()
  if (canAnimate()) animationFrame = requestAnimationFrame(tick)
}

function restartAnimation(): void {
  cancelAnimation()
  lastFrame = 0
  if (canAnimate()) animationFrame = requestAnimationFrame(tick)
  else drawFrame()
}

function handlePointerMove(event: PointerEvent): void {
  if (!props.mouseInteraction || !root.value) return
  const rect = root.value.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return
  pointerTarget.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  pointerTarget.y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height))
  if (!canAnimate()) {
    pointer.x = pointerTarget.x
    pointer.y = pointerTarget.y
    drawFrame()
  }
}

function handlePointerLeave(): void {
  pointerTarget.x = 0.5
  pointerTarget.y = 0.5
  if (!canAnimate()) {
    pointer.x = 0.5
    pointer.y = 0.5
    drawFrame()
  }
}

function handleVisibility(): void {
  pageVisible = !document.hidden
  restartAnimation()
}

function handleReducedMotion(event: MediaQueryListEvent | MediaQueryList): void {
  reducedMotion.value = event.matches
  restartAnimation()
}

function cleanupWebGL(): void {
  cancelAnimation()
  if (gl && program) gl.deleteProgram(program)
  if (gl && buffer) gl.deleteBuffer(buffer)
  try {
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    // Context loss is optional and cleanup has already released owned objects.
  }
  uniform.clear()
  program = null
  buffer = null
  gl = null
}

function setupWebGL(): void {
  if (!canvas.value) return
  try {
    gl = canvas.value.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
    })
  } catch {
    gl = null
  }
  if (!gl) {
    fallback.value = true
    return
  }

  program = createProgram()
  if (!program) {
    cleanupWebGL()
    fallback.value = true
    return
  }

  buffer = gl.createBuffer()
  if (!buffer) {
    cleanupWebGL()
    fallback.value = true
    return
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  )
  gl.useProgram(program)
  const names = [
    'iResolution',
    'iTime',
    'uSpeed',
    'uAmplitude',
    'uWaveScale',
    'uWaveRatio',
    'uSwell',
    'uTurbulence',
    'uTilt',
    'uZoom',
    'uHeight',
    'uFogDepth',
    'uSteps',
    'uBrightness',
    'uOpacity',
    'uGrain',
    'uGrainIntensity',
    'uMouse',
    'uParallax',
    'uEnableMouse',
    'uHorizonColor',
    'uWaveColor',
    'uCrestColor',
  ]
  names.forEach((name) => uniform.set(name, gl?.getUniformLocation(program as WebGLProgram, name) ?? null))
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)
  resize()
  fallback.value = false
  restartAnimation()
}

onMounted(() => {
  mounted = true
  pageVisible = !document.hidden
  if (/jsdom/i.test(navigator.userAgent)) {
    fallback.value = true
    return
  }
  mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null
  if (mediaQuery) {
    reducedMotion.value = mediaQuery.matches
    mediaQuery.addEventListener?.('change', handleReducedMotion)
  }

  root.value?.addEventListener('pointermove', handlePointerMove)
  root.value?.addEventListener('pointerleave', handlePointerLeave)
  document.addEventListener('visibilitychange', handleVisibility)

  if (typeof IntersectionObserver !== 'undefined' && root.value) {
    intersectionObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting
      restartAnimation()
    })
    intersectionObserver.observe(root.value)
  }
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(root.value)
  } else {
    window.addEventListener('resize', resize)
  }
  setupWebGL()
})

watch(
  () => [
    props.horizonColor,
    props.waveColor,
    props.crestColor,
    props.speed,
    props.amplitude,
    props.waveScale,
    props.waveRatio,
    props.swell,
    props.turbulence,
    props.tilt,
    props.zoom,
    props.height,
    props.fogDepth,
    props.detail,
    props.brightness,
    props.opacity,
    props.mouseInteraction,
    props.parallaxStrength,
    props.grain,
    props.grainIntensity,
  ],
  () => {
    resize()
    restartAnimation()
  },
)

onBeforeUnmount(() => {
  mounted = false
  root.value?.removeEventListener('pointermove', handlePointerMove)
  root.value?.removeEventListener('pointerleave', handlePointerLeave)
  document.removeEventListener('visibilitychange', handleVisibility)
  window.removeEventListener('resize', resize)
  mediaQuery?.removeEventListener?.('change', handleReducedMotion)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  cleanupWebGL()
})
</script>

<style scoped>
.gradient-waves {
  position: relative;
  width: 100%;
  min-height: 1px;
  overflow: hidden;
  isolation: isolate;
  background: var(--gradient-waves-horizon, #061329);
}

.gradient-waves__canvas,
.gradient-waves__content {
  position: absolute;
  inset: 0;
}

.gradient-waves__canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.gradient-waves__content {
  z-index: 1;
}

.gradient-waves--fallback {
  background:
    radial-gradient(120% 65% at 50% 105%, var(--gradient-waves-crest, #68bdf4) 0%, transparent 54%),
    linear-gradient(160deg, var(--gradient-waves-wave, #0b4f8a) 5%, var(--gradient-waves-horizon, #061329) 92%);
}

.gradient-waves--fallback .gradient-waves__canvas {
  display: none;
}
</style>
