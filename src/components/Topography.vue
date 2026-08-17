<template>
  <div
    ref="container"
    class="topography-container"
    :class="className"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

type ColorMode = 'elevation' | 'uniform' | 'alternating'

interface TopographyProps {
  lowColor?: string
  midColor?: string
  highColor?: string
  speed?: number
  morphAmount?: number
  morphSpeed?: number
  bands?: number
  thickness?: number
  scale?: number
  pixelSize?: number
  glow?: number
  colorMode?: ColorMode
  contrast?: number
  brightness?: number
  fillBands?: boolean
  opacity?: number
  grain?: boolean
  grainIntensity?: number
  mouseInteraction?: boolean
  mouseRadius?: number
  mouseStrength?: number
  className?: string
}

const props = withDefaults(defineProps<TopographyProps>(), {
  lowColor: '#5227FF',
  midColor: '#FF9FFC',
  highColor: '#FFFFFF',
  speed: 0.35,
  morphAmount: 3.0,
  morphSpeed: 0.05,
  bands: 2.0,
  thickness: 0.01,
  scale: 1.0,
  pixelSize: 1.0,
  glow: 0.5,
  colorMode: 'elevation',
  contrast: 3.0,
  brightness: 1.0,
  fillBands: false,
  opacity: 1.0,
  grain: true,
  grainIntensity: 0.05,
  mouseInteraction: true,
  mouseRadius: 0.3,
  mouseStrength: 0.4,
  className: '',
})

const container = ref<HTMLDivElement | null>(null)

type Runtime = {
  renderer: Renderer
  program: Program
  mesh: Mesh
  canvas: HTMLCanvasElement
}

let runtime: Runtime | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let mediaQuery: MediaQueryList | null = null
let animationFrame = 0
let inViewport = true
let pageVisible = true
let reducedMotion = false
let mounted = false
let lastTimestamp = 0
let elapsed = 0

const pointer = { x: 0.5, y: 0.5 }
const pointerTarget = { x: 0.5, y: 0.5 }
let pointerActive = 0
let pointerActiveTarget = 0

const colorModes = { elevation: 0, uniform: 1, alternating: 2 } as const
const controlIndices = [
  [1, -2, 3, -4],
  [9, -8, 7, -6],
  [5, 2, 5, -5],
  [-1, -3, 8, 9],
] as const

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uMorphAmount;
uniform float uBands;
uniform float uThickness;
uniform float uScale;
uniform float uPixelSize;
uniform float uGlow;
uniform float uColorMode;
uniform float uContrast;
uniform float uBrightness;
uniform float uFillBands;
uniform float uOpacity;
uniform vec3 uLow;
uniform vec3 uMid;
uniform vec3 uHigh;
uniform vec2 uMouse;
uniform float uMouseEnabled;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uMouseActive;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec4 uCtrlA;
uniform vec4 uCtrlB;
uniform vec4 uCtrlC;
uniform vec4 uCtrlD;
out vec4 fragColor;

float bez(float t, vec4 c) {
  float w = 6.2831853 * t;
  return 0.5 * (c.x * sin(w) + c.y * cos(w) + c.z * sin(2.0 * w) + c.w * cos(2.0 * w));
}

float field(vec2 uv) {
  vec2 a = vec2(bez(uv.x, uCtrlA), bez(uv.x, uCtrlB));
  vec2 b = vec2(bez(uv.y, uCtrlC), bez(uv.y, uCtrlD));
  return distance(a, b);
}

vec3 elevationColor(float e) {
  vec3 c = mix(uLow, uMid, smoothstep(0.0, 0.5, e));
  c = mix(c, uHigh, smoothstep(0.5, 1.0, e));
  return c;
}

void main() {
  vec2 res = iResolution.xy;
  vec2 uv = gl_FragCoord.xy / res;
  vec2 suv = (uv - 0.5) / max(uScale, 0.001) + 0.5;
  vec2 sampleUv = suv;
  if (uPixelSize > 1.0) {
    vec2 px = res / uPixelSize;
    sampleUv = (floor(suv * px) + 0.5) / px;
  }

  float fv = field(sampleUv);
  if (uMouseEnabled > 0.5) {
    vec2 d = uv - uMouse;
    d.x *= res.x / max(res.y, 1.0);
    float r = max(uMouseRadius, 0.001);
    float bump = exp(-dot(d, d) / (r * r)) * uMouseStrength * uMouseActive;
    fv += bump;
  }

  float f = fv * uBands;
  float frac = fract(f);
  float lineDist = min(frac, 1.0 - frac);
  float aa = fwidth(f) + 0.0001;
  float mask = 1.0 - smoothstep(uThickness - aa, uThickness + aa, lineDist);
  float glowR = uThickness + uGlow * 0.5 + aa;
  float glow = (1.0 - smoothstep(uThickness, glowR, lineDist)) * step(0.0001, uGlow);
  float elev = clamp(fv / (uMorphAmount * 2.5 + 0.001), 0.0, 1.0);

  vec3 lineCol;
  if (uColorMode < 0.5) {
    lineCol = elevationColor(elev);
  } else if (uColorMode < 1.5) {
    lineCol = uMid;
  } else {
    float parity = mod(floor(f), 2.0);
    lineCol = mix(uMid, uHigh, parity);
  }

  float coverage = clamp(mask + glow * 0.55, 0.0, 1.0);
  coverage = pow(coverage, max(uContrast, 0.001));
  vec3 outColor = lineCol;
  float outAlpha = coverage;
  if (uFillBands > 0.5) {
    vec3 fillCol = elevationColor(elev);
    float fillA = 0.1 * elev;
    outColor = mix(fillCol, lineCol, coverage);
    outAlpha = clamp(coverage + fillA, 0.0, 1.0);
  }
  if (uGrain > 0.5) {
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453);
    outAlpha += (g - 0.5) * uGrainIntensity;
  }

  outColor *= uBrightness;
  outColor = clamp(outColor, 0.0, 1.0);
  float a = clamp(outAlpha, 0.0, 1.0) * uOpacity;
  fragColor = vec4(outColor * a, a);
}`

function hexToRgb(value: string): [number, number, number] {
  const match = value.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!match) return [1, 1, 1]
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
  ]
}

function updateUniforms() {
  if (!runtime) return
  const { uniforms } = runtime.program
  uniforms.uMorphAmount.value = props.morphAmount
  uniforms.uBands.value = props.bands
  uniforms.uThickness.value = props.thickness
  uniforms.uScale.value = props.scale
  uniforms.uPixelSize.value = props.pixelSize
  uniforms.uGlow.value = props.glow
  uniforms.uColorMode.value = colorModes[props.colorMode]
  uniforms.uContrast.value = props.contrast
  uniforms.uBrightness.value = props.brightness
  uniforms.uFillBands.value = props.fillBands ? 1 : 0
  uniforms.uOpacity.value = Math.max(0, Math.min(1, props.opacity))
  uniforms.uGrain.value = props.grain ? 1 : 0
  uniforms.uGrainIntensity.value = props.grainIntensity
  uniforms.uLow.value = hexToRgb(props.lowColor)
  uniforms.uMid.value = hexToRgb(props.midColor)
  uniforms.uHigh.value = hexToRgb(props.highColor)
  uniforms.uMouseEnabled.value = props.mouseInteraction ? 1 : 0
  uniforms.uMouseRadius.value = props.mouseRadius
  uniforms.uMouseStrength.value = props.mouseStrength
  uniforms.uMouse.value = [pointer.x, pointer.y]
  uniforms.uMouseActive.value = pointerActive
}

function updateControls(time: number) {
  if (!runtime) return
  const uniforms = runtime.program.uniforms
  uniforms.iTime.value = time
  uniforms.uSpeed.value = props.speed
  uniforms.uMorphSpeed.value = props.morphSpeed
  uniforms.uMorphAmount.value = props.morphAmount
  const controlArrays = [
    uniforms.uCtrlA.value,
    uniforms.uCtrlB.value,
    uniforms.uCtrlC.value,
    uniforms.uCtrlD.value,
  ]
  for (let group = 0; group < controlArrays.length; group += 1) {
    const values = controlArrays[group]
    const indices = controlIndices[group]
    for (let index = 0; index < values.length; index += 1) {
      const controlIndex = indices[index]
      values[index] =
        props.morphAmount *
        Math.sin(time * props.speed * Math.sin(controlIndex * props.morphSpeed) + controlIndex)
    }
  }
}

function render() {
  if (!runtime) return
  updateControls(elapsed)
  updateUniforms()
  runtime.renderer.render({ scene: runtime.mesh })
}

function resize() {
  if (!runtime || !container.value) return
  const rect = container.value.getBoundingClientRect()
  runtime.renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)))
  runtime.program.uniforms.iResolution.value[0] = runtime.renderer.gl.drawingBufferWidth
  runtime.program.uniforms.iResolution.value[1] = runtime.renderer.gl.drawingBufferHeight
  render()
}

function shouldAnimate() {
  return mounted && pageVisible && inViewport && !reducedMotion && props.speed !== 0
}

function stopAnimation() {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  animationFrame = 0
}

function tick(timestamp: number) {
  if (!runtime) return
  if (!lastTimestamp) lastTimestamp = timestamp
  elapsed += Math.min(100, timestamp - lastTimestamp) / 1000
  lastTimestamp = timestamp
  pointer.x += (pointerTarget.x - pointer.x) * 0.05
  pointer.y += (pointerTarget.y - pointer.y) * 0.05
  pointerActive += (pointerActiveTarget - pointerActive) * 0.05
  render()
  animationFrame = shouldAnimate() ? requestAnimationFrame(tick) : 0
}

function restartAnimation() {
  stopAnimation()
  lastTimestamp = 0
  if (shouldAnimate()) animationFrame = requestAnimationFrame(tick)
  else render()
}

function onMouseMove(event: MouseEvent) {
  if (!props.mouseInteraction || !container.value) return
  const rect = container.value.getBoundingClientRect()
  pointerTarget.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  pointerTarget.y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height))
  pointerActiveTarget = 1
}

function onMouseLeave() {
  pointerActiveTarget = 0
}

function onVisibilityChange() {
  pageVisible = !document.hidden
  restartAnimation()
}

function onMotionPreference(event: MediaQueryListEvent | MediaQueryList) {
  reducedMotion = event.matches
  restartAnimation()
}

function cleanup() {
  stopAnimation()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  mediaQuery?.removeEventListener?.('change', onMotionPreference)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  container.value?.removeEventListener('mousemove', onMouseMove)
  container.value?.removeEventListener('mouseleave', onMouseLeave)
  if (runtime) {
    try {
      runtime.renderer.gl.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      // Context loss is optional during teardown.
    }
    runtime.canvas.remove()
  }
  runtime = null
}

function setup() {
  if (!container.value || /jsdom/i.test(navigator.userAgent)) return
  const probe = document.createElement('canvas')
  let supported = false
  try {
    supported = Boolean(probe.getContext('webgl2'))
  } catch {
    supported = false
  }
  if (!supported) return
  try {
    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    const canvas = gl.canvas
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    container.value.appendChild(canvas)

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: props.speed },
        uMorphAmount: { value: props.morphAmount },
        uMorphSpeed: { value: props.morphSpeed },
        uBands: { value: props.bands },
        uThickness: { value: props.thickness },
        uScale: { value: props.scale },
        uPixelSize: { value: props.pixelSize },
        uGlow: { value: props.glow },
        uColorMode: { value: colorModes[props.colorMode] },
        uContrast: { value: props.contrast },
        uBrightness: { value: props.brightness },
        uFillBands: { value: props.fillBands ? 1 : 0 },
        uOpacity: { value: props.opacity },
        uGrain: { value: props.grain ? 1 : 0 },
        uGrainIntensity: { value: props.grainIntensity },
        uLow: { value: hexToRgb(props.lowColor) },
        uMid: { value: hexToRgb(props.midColor) },
        uHigh: { value: hexToRgb(props.highColor) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseEnabled: { value: props.mouseInteraction ? 1 : 0 },
        uMouseRadius: { value: props.mouseRadius },
        uMouseStrength: { value: props.mouseStrength },
        uMouseActive: { value: 0 },
        uCtrlA: { value: new Float32Array([0, 0, 0, 0]) },
        uCtrlB: { value: new Float32Array([0, 0, 0, 0]) },
        uCtrlC: { value: new Float32Array([0, 0, 0, 0]) },
        uCtrlD: { value: new Float32Array([0, 0, 0, 0]) },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })
    runtime = { renderer, program, mesh, canvas }
    container.value.addEventListener('mousemove', onMouseMove)
    container.value.addEventListener('mouseleave', onMouseLeave)
    resize()
    restartAnimation()
  } catch {
    runtime = null
  }
}

onMounted(() => {
  mounted = true
  pageVisible = !document.hidden
  mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null
  reducedMotion = mediaQuery?.matches ?? false
  mediaQuery?.addEventListener?.('change', onMotionPreference)
  document.addEventListener('visibilitychange', onVisibilityChange)
  if (typeof ResizeObserver !== 'undefined' && container.value) {
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container.value)
  }
  if (typeof IntersectionObserver !== 'undefined' && container.value) {
    intersectionObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting
      restartAnimation()
    })
    intersectionObserver.observe(container.value)
  }
  setup()
})

watch(
  () => Object.values(props),
  () => {
    if (runtime) {
      updateUniforms()
      restartAnimation()
    }
  },
)

onBeforeUnmount(() => {
  mounted = false
  cleanup()
})
</script>

<style scoped>
.topography-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.topography-container :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
