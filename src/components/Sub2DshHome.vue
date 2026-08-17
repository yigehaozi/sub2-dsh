<template>
  <div
    ref="rootRef"
    id="top"
    class="sub2-harness-home dark"
    data-testid="sub2-harness-home"
    data-theme="dark"
  >
    <header class="sub2-header-wrapper">
      <div class="sub2-header-bar" :class="{ 'is-scrolled': isScrolled }">
        <a class="sub2-logo-wrap" href="#top" aria-label="Home">
          <span class="sub2-logo-icon">
            <span class="sub2-logo-mark">
              <img data-testid="home-logo" :src="siteLogo" alt="" />
            </span>
            <span class="sub2-logo-name">{{ siteName }}</span>
          </span>
          <span class="sub2-harness-tag-outer">
            <span data-testid="brand-chip" class="sub2-harness-tag-inner">API Gateway</span>
          </span>
        </a>

        <div
          data-testid="language-switch"
          class="sub2-lang-switch"
          role="group"
          aria-label="Language"
        >
          <button
            class="sub2-lang-btn"
            :class="{ active: isZh }"
            type="button"
            :aria-pressed="isZh"
            @click="switchLocale('zh')"
          >中文</button>
          <button
            class="sub2-lang-btn"
            :class="{ active: !isZh }"
            type="button"
            :aria-pressed="!isZh"
            @click="switchLocale('en')"
          >EN</button>
        </div>
      </div>
    </header>

    <main>
      <section
        class="sub2-hero"
      >
        <GradientWaves
          class="sub2-hero-gradient"
          horizon-color="#06152d"
          wave-color="#1554ae"
          crest-color="#91bfff"
          :speed="0.42"
          :amplitude="2.8"
          :wave-scale="0.66"
          :wave-ratio="0.9"
          :swell="38"
          :turbulence="22"
          :tilt="1.11"
          :zoom="1.05"
          :height="5.6"
          :fog-depth="16"
          :brightness="0.92"
          :opacity="0.96"
          :parallax-strength="0.7"
          :grain-intensity="0.035"
        />
        <div class="sub2-hero-fade" aria-hidden="true"></div>

        <div class="sub2-container sub2-hero-content">
          <div class="sub2-hero-left sub2-reveal">
            <div class="sub2-hero-enter-top">
              <p class="sub2-hero-kicker">{{ siteSubtitle }}</p>
              <h1>{{ siteName }}</h1>
            </div>
            <div class="sub2-hero-enter-mid">
              <p>{{ t('home.heroSubtitle') }}</p>
              <p>{{ t('home.heroDescription') }}</p>
            </div>

            <div class="sub2-hero-actions">
              <a data-testid="primary-cta" class="sub2-btn sub2-btn-primary" :href="primaryCtaUrl" target="_blank" rel="noopener noreferrer">
                {{ t('home.cta.button') }}
                <HomeIcon name="arrowRight" size="sm" :stroke-width="2" />
              </a>
              <a
                v-if="docUrl"
                data-testid="docs-cta"
                class="sub2-btn sub2-btn-secondary"
                :href="docUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HomeIcon name="book" size="sm" />
                {{ t('home.viewDocs') }}
              </a>
            </div>
          </div>

          <div class="sub2-hero-right sub2-reveal">
            <div class="sub2-code-tabs">
              <button
                class="sub2-code-tab"
                :class="{ active: heroTab === 'request' }"
                type="button"
                :aria-pressed="heroTab === 'request'"
                @click="heroTab = 'request'"
              >{{ isZh ? '快速接入' : 'Quick start' }}</button>
              <button
                class="sub2-code-tab"
                :class="{ active: heroTab === 'routing' }"
                type="button"
                :aria-pressed="heroTab === 'routing'"
                @click="heroTab = 'routing'"
              >{{ isZh ? '智能路由' : 'Smart routing' }}</button>
            </div>

            <div class="sub2-hero-codebox">
              <div class="sub2-codebox-header">
                <div class="sub2-traffic-lights" aria-hidden="true">
                  <span class="sub2-tl sub2-tl-red"></span>
                  <span class="sub2-tl sub2-tl-yellow"></span>
                  <span class="sub2-tl sub2-tl-green"></span>
                </div>
                <button class="sub2-copy-btn" type="button" @click="copyHeroCommand">
                  <HomeIcon :name="copied ? 'check' : 'copy'" size="xs" />
                  {{ copied ? (isZh ? '已复制' : 'Copied') : (isZh ? '复制' : 'Copy') }}
                </button>
              </div>
              <div class="sub2-codebox-body">
                <pre><span class="sub2-command-prompt">$ </span>{{ heroCommand }}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" class="sub2-section sub2-features-section">
        <div class="sub2-container">
          <div class="sub2-title-block sub2-reveal">
            <span class="sub2-grad-pill">
              <span class="sub2-kicker-inner">ONE KEY = ALL MODELS</span>
            </span>
            <h2>
              <span class="sub2-font-harness">{{ siteName }}</span>
              {{ t('home.solutions.title') }}
            </h2>
            <div class="sub2-section-subs">
              <p>
                {{ t('home.tags.subscriptionToApi') }} · {{ t('home.tags.stickySession') }} ·
                {{ t('home.tags.realtimeBilling') }}
              </p>
              <p>{{ t('home.solutions.subtitle') }}</p>
            </div>
          </div>

          <div class="sub2-feature-grid">
            <article class="sub2-feature-card sub2-reveal">
              <span class="sub2-feature-icon"><HomeIcon name="server" size="lg" /></span>
              <h3>{{ t('home.features.unifiedGateway') }}</h3>
              <span class="sub2-feature-en">UNIFIED GATEWAY</span>
              <p>{{ t('home.features.unifiedGatewayDesc') }}</p>
            </article>

            <article class="sub2-feature-card sub2-reveal">
              <span class="sub2-feature-icon"><HomeIcon name="sync" size="lg" /></span>
              <h3>{{ t('home.features.multiAccount') }}</h3>
              <span class="sub2-feature-en">SMART ACCOUNT POOL</span>
              <p>{{ t('home.features.multiAccountDesc') }}</p>
            </article>

            <article class="sub2-feature-card sub2-reveal">
              <span class="sub2-feature-icon"><HomeIcon name="chart" size="lg" /></span>
              <h3>{{ t('home.features.balanceQuota') }}</h3>
              <span class="sub2-feature-en">USAGE AND QUOTA</span>
              <p>{{ t('home.features.balanceQuotaDesc') }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="sub2-section sub2-workflow-section">
        <div class="sub2-container">
          <div class="sub2-workflow-title sub2-reveal">
            <span class="sub2-grad-pill">
              <span class="sub2-kicker-inner">ROUTING WORKFLOW</span>
            </span>
            <h2>{{ t('home.heroSubtitle') }}</h2>
          </div>

          <div class="sub2-workflow-grid">
            <div class="sub2-workflow-list">
              <button
                v-for="(feature, index) in workflowFeatures"
                :key="feature.title"
                type="button"
                class="sub2-workflow-item"
                :class="{ active: activeFeature === index }"
                :aria-pressed="activeFeature === index"
                @click="activeFeature = index"
              >
                <span class="sub2-workflow-item-head">
                  <HomeIcon :name="feature.icon" size="lg" />
                  <strong>{{ feature.title }}</strong>
                </span>
                <span>{{ feature.description }}</span>
              </button>
            </div>

            <div class="sub2-product-sticky sub2-reveal">
              <div class="sub2-product-frame">
                <div class="sub2-product-topbar">
                  <span><i></i><i></i><i></i></span>
                  <small>{{ siteName }} / CONTROL PLANE</small>
                  <em>LIVE</em>
                </div>

                <div v-if="activeFeature === 0" class="sub2-product-route">
                  <div class="sub2-product-request">POST <b>/v1/messages</b></div>
                  <div class="sub2-product-path">
                    <span>SDK</span><i></i><span class="active">GATEWAY</span><i></i><span>MODEL</span>
                  </div>
                  <div class="sub2-product-response">200 OK <small>1.8s</small></div>
                </div>

                <div v-else-if="activeFeature === 1" class="sub2-product-accounts">
                  <div v-for="index in 12" :key="index" :class="{ active: index !== 4 && index !== 9 }">
                    <span>UP-{{ String(index).padStart(2, '0') }}</span>
                    <small>{{ index === 4 || index === 9 ? 'STANDBY' : 'HEALTHY' }}</small>
                  </div>
                </div>

                <div v-else class="sub2-product-usage">
                  <div class="sub2-usage-summary">
                    <span><small>REQUESTS</small><b>24,892</b></span>
                    <span><small>SUCCESS</small><b>99.98%</b></span>
                    <span><small>SPEND</small><b>$128.40</b></span>
                  </div>
                  <div class="sub2-usage-chart" aria-hidden="true">
                    <i v-for="height in usageBars" :key="height" :style="{ height: `${height}%` }"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="sub2-cta-section">
        <div class="sub2-cta-ambient" aria-hidden="true">
          <TopographyBackground
            class-name="sub2-cta-topography"
            low-color="#24416f"
            mid-color="#3f66a5"
            high-color="#6799fe"
            :speed="0.35"
            :morph-amount="3"
            :morph-speed="0.05"
            :bands="2"
            :thickness="0.01"
            :scale="1"
            :pixel-size="1"
            :glow="0.5"
            color-mode="elevation"
            :contrast="3"
            :brightness="0.38"
            :fill-bands="false"
            :opacity="0.32"
            :grain="true"
            :grain-intensity="0.012"
            :mouse-interaction="true"
            :mouse-radius="0.3"
            :mouse-strength="0.15"
          />
        </div>
        <div class="sub2-container sub2-cta-inner sub2-reveal">
          <span class="sub2-section-kicker">START ROUTING</span>
          <h2>{{ t('home.cta.title') }}</h2>
          <p>{{ t('home.cta.description') }}</p>
          <div class="sub2-cta-actions">
            <a class="sub2-btn sub2-btn-primary" :href="primaryCtaUrl" target="_blank" rel="noopener noreferrer">
              {{ t('home.cta.button') }}
              <HomeIcon name="arrowRight" size="sm" :stroke-width="2" />
            </a>
            <a
              v-if="docUrl"
              class="sub2-btn sub2-btn-secondary"
              :href="docUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t('home.viewDocs') }}
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer class="sub2-footer">
      <div class="sub2-container sub2-footer-inner">
        <a class="sub2-footer-brand" href="#top">
          <span class="sub2-footer-logo-mark">
            <img :src="siteLogo" alt="" />
          </span>
          <span>{{ siteName }}</span>
        </a>
        <p>&copy; {{ currentYear }} {{ siteName }}. {{ t('home.footer.allRightsReserved') }}</p>
        <nav aria-label="Footer navigation">
          <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer">
            {{ t('home.docs') }}
          </a>
          <a data-testid="source-link" :href="sourceRepositoryUrl" target="_blank" rel="noopener noreferrer">
            {{ sourceRepositoryUrl }}
          </a>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import HomeIcon from './HomeIcon.vue'
import GradientWaves from './GradientWaves.vue'
import TopographyBackground from './Topography.vue'
import { setLocale } from '../i18n'
import { ORIGIN_REPOSITORY_URL, type SiteConfig } from '../config'

const props = withDefaults(defineProps<{
  config: SiteConfig
  currentYear?: number
}>(), {
  currentYear: new Date().getFullYear(),
})

const siteName = computed(() => props.config.siteName)
const siteSubtitle = computed(() => props.config.siteSubtitle)
const siteLogo = computed(() => props.config.siteLogo)
const primaryCtaUrl = computed(() => props.config.primaryCtaUrl)
const docUrl = computed(() => props.config.docsUrl)
const currentYear = computed(() => props.currentYear)
const sourceRepositoryUrl = ORIGIN_REPOSITORY_URL

const { t, locale } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
const isScrolled = ref(false)
const heroTab = ref<'request' | 'routing'>('request')
const copied = ref(false)
const activeFeature = ref(0)
const isZh = computed(() => locale.value.startsWith('zh'))
const heroCommand = computed(() => heroTab.value === 'request'
  ? 'curl -X POST /v1/messages -H "Authorization: Bearer sk-..."'
  : 'request -> account pool -> session affinity -> 200 OK')
const workflowFeatures = computed(() => [
  {
    icon: 'server' as const,
    title: t('home.features.unifiedGateway'),
    description: t('home.features.unifiedGatewayDesc'),
  },
  {
    icon: 'sync' as const,
    title: t('home.features.multiAccount'),
    description: t('home.features.multiAccountDesc'),
  },
  {
    icon: 'chart' as const,
    title: t('home.features.balanceQuota'),
    description: t('home.features.balanceQuotaDesc'),
  },
])
const usageBars = [36, 52, 47, 68, 61, 82, 74, 91, 67, 84, 72, 96]

let observer: IntersectionObserver | null = null

async function switchLocale(code: 'zh' | 'en') {
  if (locale.value === code) return
  await setLocale(code)
}

async function copyHeroCommand() {
  try {
    await navigator.clipboard.writeText(heroCommand.value)
    copied.value = true
    window.setTimeout(() => { copied.value = false }, 1500)
  } catch {
    copied.value = false
  }
}

function handleScroll() {
  isScrolled.value = window.scrollY > 64
  syncWorkflowFeature()
}

function syncWorkflowFeature() {
  if (window.innerWidth < 768) return
  const items = Array.from(rootRef.value?.querySelectorAll<HTMLElement>('.sub2-workflow-item') ?? [])
  if (!items.length) return

  const viewportCenter = window.innerHeight * 0.5
  let closestIndex = activeFeature.value
  let closestDistance = Number.POSITIVE_INFINITY

  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect()
    const itemCenter = rect.top + rect.height * 0.5
    const distance = Math.abs(itemCenter - viewportCenter)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  activeFeature.value = closestIndex
}

function setupRevealObserver() {
  const elements = rootRef.value?.querySelectorAll<HTMLElement>('.sub2-reveal') ?? []
  if (typeof IntersectionObserver === 'undefined') {
    elements.forEach((element) => element.classList.add('is-visible'))
    return
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      ;(entry.target as HTMLElement).classList.add('is-visible')
      observer?.unobserve(entry.target)
    })
  }, { threshold: 0.14 })
  elements.forEach((element) => observer?.observe(element))
}

onMounted(() => {
  handleScroll()
  setupRevealObserver()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', syncWorkflowFeature, { passive: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', syncWorkflowFeature)
})
</script>

<style scoped>
.sub2-harness-home {
  --sub2-home-bg: #0a0a0a;
  --sub2-home-surface: rgba(255, 255, 255, 0.055);
  --sub2-home-surface-strong: rgba(255, 255, 255, 0.085);
  --sub2-home-border: rgba(255, 255, 255, 0.1);
  --sub2-home-border-soft: rgba(255, 255, 255, 0.065);
  --sub2-home-text: #ffffff;
  --sub2-home-text-soft: rgba(255, 255, 255, 0.72);
  --sub2-home-text-muted: rgba(255, 255, 255, 0.52);
  --sub2-home-blue: #6799fe;
  --sub2-home-blue-soft: rgba(103, 153, 254, 0.16);
  --sub2-home-green: #6dd6a8;
  --sub2-home-font-sans: 'HarmonyOS Sans SC', 'HarmonyOS Sans', system-ui, -apple-system,
    BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-width: 0;
  min-height: 100vh;
  overflow-x: clip;
  background: var(--sub2-home-bg);
  color: var(--sub2-home-text);
  font-family: var(--sub2-home-font-sans);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.sub2-harness-home *,
.sub2-harness-home *::before,
.sub2-harness-home *::after {
  box-sizing: border-box;
}

.sub2-harness-home a,
.sub2-harness-home button {
  cursor: pointer;
}

.sub2-harness-home a:focus-visible,
.sub2-harness-home button:focus-visible {
  outline: 2px solid var(--sub2-home-blue);
  outline-offset: 3px;
}

.sub2-container {
  position: relative;
  width: min(calc(100% - 144px), 1140px);
  margin: 0 auto;
}

.sub2-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  padding: 10px 0 0;
  transition: padding 220ms ease;
}

.sub2-header-inner {
  display: flex;
  width: min(calc(100% - 144px), 1140px);
  min-height: 58px;
  margin: 0 auto;
  padding: 8px 12px 8px 14px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid transparent;
  border-radius: 12px;
  transition: background-color 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

.sub2-header.is-scrolled {
  padding-top: 7px;
}

.sub2-header.is-scrolled .sub2-header-inner,
.sub2-header:has(.sub2-mobile-nav) .sub2-header-inner {
  border-color: var(--sub2-home-border);
  background: rgba(12, 12, 12, 0.78);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.26);
  backdrop-filter: blur(18px);
}

.sub2-brand,
.sub2-footer-brand {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  color: var(--sub2-home-text);
  text-decoration: none;
}

.sub2-brand {
  gap: 10px;
}

.sub2-brand-mark {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--sub2-home-border);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.06);
}

.sub2-brand-mark img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.sub2-brand-name {
  max-width: 230px;
  overflow: hidden;
  font-family: var(--sub2-home-font-sans);
  font-size: 16px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sub2-brand-chip {
  padding: 4px 7px 3px;
  border: 1px solid var(--sub2-home-border);
  border-radius: 6px;
  color: var(--sub2-home-text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  line-height: 1;
}

.sub2-desktop-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sub2-nav-link {
  padding: 8px 10px;
  color: var(--sub2-home-text-soft);
  font-size: 14px;
  text-decoration: none;
  transition: color 180ms ease;
}

.sub2-nav-link:hover {
  color: var(--sub2-home-text);
}

.sub2-locale {
  color: var(--sub2-home-text-soft);
}

.sub2-header-cta,
.sub2-mobile-cta {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  background: #fff;
  color: #0a0a0a;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}

.sub2-header-cta {
  padding: 8px 15px;
}

.sub2-menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--sub2-home-border);
  border-radius: 9px;
  background: var(--sub2-home-surface);
  color: var(--sub2-home-text);
}

.sub2-mobile-nav {
  width: min(calc(100% - 48px), 1140px);
  margin: 8px auto 0;
  padding: 12px;
  border: 1px solid var(--sub2-home-border);
  border-radius: 12px;
  background: rgba(12, 12, 12, 0.96);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42);
}

.sub2-mobile-nav > a:not(.sub2-mobile-cta) {
  display: flex;
  min-height: 48px;
  padding: 0 10px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--sub2-home-border-soft);
  color: var(--sub2-home-text-soft);
  text-decoration: none;
}

.sub2-mobile-locale {
  padding: 9px 2px;
}

.sub2-mobile-cta {
  width: 100%;
  margin-top: 6px;
  padding: 10px 16px;
}

.sub2-hero {
  position: relative;
  display: flex;
  min-height: 820px;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
}

.sub2-hero::before,
.sub2-hero::after {
  position: absolute;
  z-index: -3;
  border-radius: 50%;
  content: '';
  filter: blur(90px);
  pointer-events: none;
}

.sub2-hero::before {
  top: 12%;
  right: 7%;
  width: 440px;
  height: 360px;
  background: rgba(54, 91, 174, 0.16);
}

.sub2-hero::after {
  bottom: 8%;
  left: 26%;
  width: 340px;
  height: 240px;
  background: rgba(27, 56, 128, 0.1);
}

.sub2-hero-fade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sub2-hero-fade {
  z-index: -1;
  background: linear-gradient(180deg, rgba(10, 10, 10, 0) 68%, var(--sub2-home-bg) 100%);
}

.sub2-hero-layout {
  display: grid;
  padding: 132px 0 72px;
  align-items: center;
  grid-template-columns: minmax(0, 1.03fr) minmax(420px, 0.97fr);
  gap: clamp(48px, 6vw, 92px);
}

.sub2-hero-copy {
  min-width: 0;
}

.sub2-eyebrow,
.sub2-section-kicker {
  font-family: var(--sub2-home-font-sans);
  font-weight: 500;
  text-transform: uppercase;
}

.sub2-eyebrow {
  display: inline-flex;
  padding: 7px 10px;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--sub2-home-border);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.035);
  color: var(--sub2-home-text-soft);
  font-size: 11px;
}

.sub2-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--sub2-home-blue);
  box-shadow: 0 0 12px var(--sub2-home-blue);
}

.sub2-hero h1 {
  max-width: 100%;
  margin: 22px 0 14px;
  overflow-wrap: anywhere;
  font-family: var(--sub2-home-font-sans);
  font-size: clamp(48px, 4.4vw, 66px);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: 0;
}

.sub2-hero-subtitle {
  margin: 0;
  color: var(--sub2-home-text);
  font-size: clamp(20px, 1.7vw, 26px);
  line-height: 1.35;
}

.sub2-hero-description {
  max-width: 600px;
  margin: 18px 0 0;
  color: var(--sub2-home-text-muted);
  font-size: 16px;
  line-height: 1.75;
}

.sub2-hero-actions,
.sub2-cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.sub2-hero-actions {
  margin-top: 30px;
}

.sub2-btn {
  display: inline-flex;
  min-height: 44px;
  padding: 11px 19px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease;
}

.sub2-btn-primary {
  background: #fff;
  color: #0a0a0a;
}

.sub2-btn-primary:hover {
  background: #e9eefc;
}

.sub2-btn-secondary {
  border-color: var(--sub2-home-border);
  background: var(--sub2-home-surface);
  color: var(--sub2-home-text);
}

.sub2-btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.22);
  background: var(--sub2-home-surface-strong);
}

.sub2-terminal-wrap {
  position: relative;
  min-width: 0;
}

.sub2-terminal-glow {
  position: absolute;
  inset: 15% 8%;
  z-index: -1;
  border-radius: 40%;
  background: rgba(76, 122, 225, 0.25);
  filter: blur(60px);
}

.sub2-terminal {
  height: 400px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 13px;
  background: rgba(14, 15, 18, 0.78);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.42), inset 0 1px rgba(255, 255, 255, 0.055);
  backdrop-filter: blur(20px);
}

.sub2-terminal-head {
  display: grid;
  height: 54px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid var(--sub2-home-border-soft);
  grid-template-columns: 1fr auto 1fr;
}

.sub2-window-dots {
  display: flex;
  gap: 7px;
}

.sub2-window-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
}

.sub2-terminal-title,
.sub2-live,
.sub2-terminal-metrics,
.sub2-route-row small,
.sub2-route-state,
.sub2-route-success {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.sub2-terminal-title {
  color: var(--sub2-home-text-muted);
  font-size: 10px;
}

.sub2-live {
  display: flex;
  justify-self: end;
  align-items: center;
  gap: 6px;
  color: var(--sub2-home-green);
  font-size: 9px;
}

.sub2-live i,
.sub2-terminal-metrics i,
.sub2-provider-status i {
  display: inline-block;
  border-radius: 50%;
  background: currentColor;
}

.sub2-live i {
  width: 5px;
  height: 5px;
  box-shadow: 0 0 10px currentColor;
  animation: sub2-pulse 1.8s ease-in-out infinite;
}

.sub2-terminal-body {
  padding: 22px;
}

.sub2-command-line {
  display: flex;
  height: 42px;
  padding: 0 12px;
  align-items: center;
  gap: 9px;
  border: 1px solid var(--sub2-home-border-soft);
  border-radius: 7px;
  background: rgba(0, 0, 0, 0.22);
  color: var(--sub2-home-text-soft);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
}

.sub2-prompt {
  color: var(--sub2-home-blue);
}

.sub2-command {
  color: var(--sub2-home-green);
}

.sub2-route-flow {
  padding: 21px 4px 17px;
}

.sub2-route-row {
  display: grid;
  min-height: 52px;
  align-items: center;
  grid-template-columns: 30px minmax(0, 1fr) auto;
  gap: 10px;
}

.sub2-route-step {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border: 1px solid var(--sub2-home-border);
  border-radius: 50%;
  color: var(--sub2-home-text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 8px;
}

.sub2-route-row div {
  min-width: 0;
}

.sub2-route-row small {
  display: block;
  margin-bottom: 3px;
  color: var(--sub2-home-text-muted);
  font-size: 8px;
}

.sub2-route-row strong {
  display: block;
  overflow: hidden;
  color: var(--sub2-home-text-soft);
  font-size: 12px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sub2-route-state,
.sub2-route-success {
  padding: 4px 6px;
  border-radius: 5px;
  font-size: 8px;
}

.sub2-route-state {
  background: var(--sub2-home-blue-soft);
  color: #9fbdff;
}

.sub2-route-success {
  background: rgba(109, 214, 168, 0.12);
  color: var(--sub2-home-green);
}

.sub2-route-line {
  width: 1px;
  height: 11px;
  margin: -4px 0 -4px 16px;
  background: linear-gradient(var(--sub2-home-border), transparent);
}

.sub2-terminal-metrics {
  display: flex;
  padding-top: 12px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--sub2-home-border-soft);
  color: var(--sub2-home-text-muted);
  font-size: 8px;
  text-transform: uppercase;
}

.sub2-terminal-metrics span:first-child {
  color: var(--sub2-home-green);
}

.sub2-terminal-metrics i {
  width: 4px;
  height: 4px;
  margin-right: 5px;
}

.sub2-capability-band {
  border-top: 1px solid var(--sub2-home-border-soft);
  border-bottom: 1px solid var(--sub2-home-border-soft);
  background: rgba(255, 255, 255, 0.018);
}

.sub2-capability-list {
  display: grid;
  min-height: 76px;
  align-items: center;
  grid-template-columns: 1fr auto 1fr auto 1fr;
}

.sub2-capability-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--sub2-home-text-soft);
  font-size: 13px;
  font-weight: 500;
}

.sub2-capability-item svg {
  color: var(--sub2-home-blue);
}

.sub2-capability-divider {
  width: 1px;
  height: 24px;
  background: var(--sub2-home-border-soft);
}

.sub2-section {
  padding: 120px 0;
}

.sub2-section-heading {
  max-width: 720px;
}

.sub2-section-kicker {
  display: inline-block;
  margin-bottom: 14px;
  color: var(--sub2-home-blue);
  font-size: 11px;
}

.sub2-section h2,
.sub2-cta-section h2 {
  margin: 0;
  font-family: var(--sub2-home-font-sans);
  font-size: clamp(36px, 3.5vw, 50px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: 0;
}

.sub2-section-heading > p,
.sub2-provider-heading > p,
.sub2-cta-inner > p {
  color: var(--sub2-home-text-muted);
  font-size: 16px;
  line-height: 1.7;
}

.sub2-section-heading > p {
  margin: 18px 0 0;
}

.sub2-feature-grid {
  display: grid;
  margin-top: 58px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.sub2-feature-card {
  min-height: 350px;
  padding: 25px;
  overflow: hidden;
  border: 1px solid var(--sub2-home-border-soft);
  border-radius: 10px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.018));
  transition: border-color 220ms ease, background-color 220ms ease;
}

.sub2-feature-card:hover {
  border-color: rgba(103, 153, 254, 0.26);
  background: linear-gradient(145deg, rgba(103, 153, 254, 0.075), rgba(255, 255, 255, 0.02));
}

.sub2-feature-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sub2-feature-index {
  color: var(--sub2-home-text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
}

.sub2-feature-icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border: 1px solid rgba(103, 153, 254, 0.22);
  border-radius: 9px;
  background: var(--sub2-home-blue-soft);
  color: #a7c1ff;
}

.sub2-feature-card h3 {
  margin: 34px 0 10px;
  font-family: var(--sub2-home-font-sans);
  font-size: 21px;
  font-weight: 500;
}

.sub2-feature-card > p {
  min-height: 78px;
  margin: 0;
  color: var(--sub2-home-text-muted);
  font-size: 14px;
  line-height: 1.75;
}

.sub2-mini-route,
.sub2-health-nodes,
.sub2-usage-bars {
  height: 72px;
  margin-top: 28px;
  border-top: 1px solid var(--sub2-home-border-soft);
}

.sub2-mini-route {
  display: flex;
  align-items: end;
  gap: 7px;
  color: var(--sub2-home-text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 8px;
}

.sub2-mini-route span {
  padding: 5px 7px;
  border: 1px solid var(--sub2-home-border);
  border-radius: 5px;
}

.sub2-mini-route span.active {
  border-color: rgba(103, 153, 254, 0.35);
  background: var(--sub2-home-blue-soft);
  color: #a7c1ff;
}

.sub2-mini-route i {
  width: 18px;
  height: 1px;
  margin-bottom: 12px;
  background: linear-gradient(90deg, var(--sub2-home-border), var(--sub2-home-blue));
}

.sub2-health-nodes {
  display: grid;
  padding-top: 23px;
  grid-template-columns: repeat(9, 1fr);
  gap: 6px;
}

.sub2-health-nodes span {
  height: 24px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
}

.sub2-health-nodes span.healthy {
  background: linear-gradient(180deg, rgba(103, 153, 254, 0.42), rgba(103, 153, 254, 0.12));
}

.sub2-usage-bars {
  display: flex;
  padding-top: 18px;
  align-items: end;
  gap: 8px;
}

.sub2-usage-bars span {
  width: 100%;
  height: var(--bar);
  border-radius: 3px 3px 0 0;
  background: linear-gradient(180deg, rgba(103, 153, 254, 0.66), rgba(103, 153, 254, 0.12));
}

.sub2-providers-section {
  border-top: 1px solid var(--sub2-home-border-soft);
  border-bottom: 1px solid var(--sub2-home-border-soft);
  background: rgba(255, 255, 255, 0.015);
}

.sub2-provider-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 40px;
}

.sub2-provider-heading > p {
  margin: 0 0 4px;
}

.sub2-provider-list {
  display: grid;
  margin-top: 50px;
  border-top: 1px solid var(--sub2-home-border);
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.sub2-provider-item {
  display: grid;
  min-width: 0;
  min-height: 130px;
  padding: 24px 18px;
  align-content: center;
  border-right: 1px solid var(--sub2-home-border);
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 8px 10px;
}

.sub2-provider-item:last-child {
  border-right: 0;
}

.sub2-provider-icon {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 8px;
  background: #f5f7fb;
}

.sub2-provider-name {
  align-self: center;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sub2-provider-status {
  display: inline-flex;
  grid-column: 1 / -1;
  align-items: center;
  gap: 6px;
  color: var(--sub2-home-green);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 8px;
  text-transform: uppercase;
}

.sub2-provider-status i {
  width: 5px;
  height: 5px;
}

.sub2-provider-status.muted {
  color: var(--sub2-home-text-muted);
}

.sub2-cta-section {
  position: relative;
  padding: 140px 0;
  overflow: hidden;
  text-align: center;
}

.sub2-cta-inner {
  display: flex;
  max-width: 760px;
  align-items: center;
  flex-direction: column;
}

.sub2-cta-inner > p {
  max-width: 620px;
  margin: 18px 0 28px;
}

.sub2-cta-actions {
  justify-content: center;
}

.sub2-footer {
  padding: 0 0 28px;
}

.sub2-footer-inner {
  display: grid;
  min-height: 100px;
  padding-top: 28px;
  align-items: center;
  border-top: 1px solid var(--sub2-home-border-soft);
  grid-template-columns: 1fr auto 1fr;
  gap: 28px;
}

.sub2-footer-brand {
  gap: 9px;
  font-size: 13px;
}

.sub2-footer-logo-mark {
  display: grid;
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
  place-items: center;
  overflow: hidden;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
}

.sub2-footer-logo-mark img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
}

.sub2-footer p {
  margin: 0;
  color: var(--sub2-home-text-muted);
  font-size: 11px;
  text-align: center;
}

.sub2-footer nav {
  display: flex;
  justify-self: end;
  gap: 18px;
}

.sub2-footer nav a {
  color: var(--sub2-home-text-muted);
  font-size: 12px;
  text-decoration: none;
}

.sub2-footer nav a:hover {
  color: var(--sub2-home-text);
}

.sub2-reveal {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 650ms ease, transform 650ms ease;
}

.sub2-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes sub2-pulse {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 1; }
}

@media (max-width: 1040px) {
  .sub2-container,
  .sub2-header-inner {
    width: min(calc(100% - 64px), 1140px);
  }

  .sub2-hero-layout {
    grid-template-columns: minmax(0, 1fr) minmax(350px, 0.9fr);
    gap: 40px;
  }

  .sub2-terminal {
    height: 330px;
  }

  .sub2-terminal-body {
    padding: 16px;
  }

  .sub2-route-flow {
    padding: 13px 2px 8px;
  }

  .sub2-route-row {
    min-height: 43px;
  }

  .sub2-terminal-metrics {
    display: none;
  }

  .sub2-feature-card {
    min-height: 370px;
  }

  .sub2-provider-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .sub2-provider-item:nth-child(3) {
    border-right: 0;
  }

  .sub2-provider-item:nth-child(n + 4) {
    border-top: 1px solid var(--sub2-home-border);
  }
}

@media (max-width: 899px) {
  .sub2-desktop-nav {
    display: none;
  }

  .sub2-menu-toggle {
    display: inline-flex;
  }

  .sub2-hero {
    min-height: auto;
  }

  .sub2-hero-layout {
    padding: 128px 0 74px;
    grid-template-columns: minmax(0, 1fr);
    gap: 64px;
  }

  .sub2-hero-copy {
    max-width: 680px;
  }

  .sub2-terminal-wrap {
    width: min(100%, 680px);
  }

  .sub2-terminal {
    height: 330px;
  }

  .sub2-feature-grid {
    grid-template-columns: 1fr;
  }

  .sub2-feature-card {
    min-height: 320px;
  }

  .sub2-feature-card > p {
    min-height: 0;
  }

  .sub2-provider-heading {
    align-items: start;
    flex-direction: column;
    gap: 16px;
  }

  .sub2-footer-inner {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 14px;
  }

  .sub2-footer nav {
    justify-self: center;
  }
}

@media (max-width: 767px) {
  .sub2-container,
  .sub2-header-inner {
    width: calc(100% - 48px);
  }

  .sub2-header {
    padding-top: 7px;
  }

  .sub2-header-inner {
    min-height: 54px;
    padding: 6px 8px 6px 10px;
  }

  .sub2-brand-mark {
    width: 32px;
    height: 32px;
    flex-basis: 32px;
  }

  .sub2-brand-mark img {
    width: 22px;
    height: 22px;
  }

  .sub2-brand-name {
    max-width: min(42vw, 190px);
    font-size: 15px;
  }

  .sub2-brand-chip {
    display: none;
  }

  .sub2-mobile-nav {
    width: calc(100% - 48px);
  }

  .sub2-hero-layout {
    padding: 116px 0 68px;
    gap: 52px;
  }

  .sub2-eyebrow {
    font-size: 10px;
  }

  .sub2-hero h1 {
    margin-top: 18px;
    font-size: 36px;
    line-height: 1.04;
  }

  .sub2-hero-subtitle {
    font-size: 19px;
  }

  .sub2-hero-description {
    font-size: 16px;
  }

  .sub2-hero-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .sub2-btn {
    width: 100%;
  }

  .sub2-terminal {
    height: 278px;
  }

  .sub2-terminal-head {
    height: 45px;
    padding: 0 12px;
  }

  .sub2-terminal-title {
    font-size: 8px;
  }

  .sub2-terminal-body {
    padding: 12px;
  }

  .sub2-command-line {
    height: 35px;
    font-size: 10px;
  }

  .sub2-route-flow {
    padding-top: 9px;
  }

  .sub2-route-row {
    min-height: 38px;
    grid-template-columns: 26px minmax(0, 1fr) auto;
    gap: 7px;
  }

  .sub2-route-step {
    width: 20px;
    height: 20px;
    font-size: 7px;
  }

  .sub2-route-row small,
  .sub2-route-state,
  .sub2-route-success {
    font-size: 7px;
  }

  .sub2-route-row strong {
    font-size: 10px;
  }

  .sub2-route-line {
    height: 7px;
    margin-left: 13px;
  }

  .sub2-capability-list {
    padding: 12px 0;
    grid-template-columns: 1fr;
  }

  .sub2-capability-item {
    min-height: 42px;
    justify-content: flex-start;
  }

  .sub2-capability-divider {
    width: 100%;
    height: 1px;
  }

  .sub2-section {
    padding: 82px 0;
  }

  .sub2-section h2,
  .sub2-cta-section h2 {
    font-size: 34px;
  }

  .sub2-feature-grid {
    margin-top: 38px;
  }

  .sub2-feature-card {
    min-height: 0;
    padding: 22px;
  }

  .sub2-feature-card h3 {
    margin-top: 28px;
  }

  .sub2-provider-list {
    margin-top: 36px;
    grid-template-columns: 1fr;
  }

  .sub2-provider-item,
  .sub2-provider-item:nth-child(3),
  .sub2-provider-item:nth-child(n + 4) {
    min-height: 82px;
    padding: 16px 10px;
    border-top: 1px solid var(--sub2-home-border);
    border-right: 0;
    grid-template-columns: 34px minmax(0, 1fr) auto;
  }

  .sub2-provider-item:first-child {
    border-top: 0;
  }

  .sub2-provider-status {
    grid-column: auto;
  }

  .sub2-cta-section {
    padding: 100px 0;
  }

  .sub2-cta-actions {
    width: 100%;
  }

  .sub2-footer {
    padding-bottom: 20px;
  }
}

/* Reference geometry from DeepSeek Harness */
.sub2-header-wrapper {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  width: min(calc(100% - 48px), 1140px);
  margin: 0 auto;
  padding-top: 8px;
}

.sub2-container {
  width: min(calc(100% - 48px), 1140px);
}

.sub2-header-bar {
  position: relative;
  display: flex;
  padding: 4px 0;
  align-items: center;
  justify-content: space-between;
  border: 1px solid transparent;
  border-radius: 100px;
  transition: margin 800ms cubic-bezier(0.4, 0, 0.2, 1), padding 800ms cubic-bezier(0.4, 0, 0.2, 1);
}

.sub2-header-bar::before {
  position: absolute;
  inset: -1px;
  z-index: -1;
  visibility: hidden;
  border: 1px solid var(--sub2-home-border-soft);
  border-radius: inherit;
  background: rgba(255, 255, 255, 0.25);
  opacity: 0;
  content: '';
  pointer-events: none;
  backdrop-filter: blur(12px);
  transition: opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), visibility 800ms cubic-bezier(0.4, 0, 0.2, 1);
}

.sub2-header-bar.is-scrolled {
  margin: 0 80px;
  padding: 4px 6px 4px 16px;
}

.sub2-header-bar.is-scrolled::before {
  visibility: visible;
  opacity: 1;
}

.sub2-logo-wrap {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  color: var(--sub2-home-text);
  text-decoration: none;
}

.sub2-logo-icon {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}

.sub2-logo-mark {
  display: grid;
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
  place-items: center;
  overflow: hidden;
  border-radius: 6px;
}

.sub2-logo-mark img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sub2-logo-name {
  max-width: 250px;
  overflow: hidden;
  font-family: var(--sub2-home-font-sans);
  font-size: 22px;
  font-weight: 500;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sub2-harness-tag-outer {
  display: inline-flex;
  min-width: 0;
  padding: 1px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.08) 35%, rgba(255, 255, 255, 0.04) 65%, rgba(255, 255, 255, 0.28));
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.08), 0 0 32px rgba(255, 255, 255, 0.04);
}

.sub2-harness-tag-inner {
  display: inline-block;
  padding: 4px 9px 3px;
  border-radius: 7px;
  background: rgba(0, 0, 0, 0.25);
  color: rgba(255, 255, 255, 0.95);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.sub2-lang-switch {
  display: inline-flex;
  height: 32px;
  align-items: center;
}

.sub2-lang-btn {
  display: flex;
  height: 24px;
  padding: 0 12px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 100px;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font: 500 12px/1 inherit;
  transition: color 200ms ease, background-color 200ms ease, box-shadow 200ms ease;
  white-space: nowrap;
}

.sub2-lang-btn.active {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  color: #fff;
}

.sub2-hero {
  position: relative;
  display: flex;
  width: 100%;
  height: 100vh;
  max-height: 1000px;
  min-height: 720px;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
}

.sub2-hero::before,
.sub2-hero::after {
  display: none;
}

.sub2-hero-gradient,
.sub2-hero-fade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sub2-hero-gradient {
  z-index: 0;
}

.sub2-hero-fade {
  z-index: 5;
  background: linear-gradient(to bottom, transparent, rgba(10, 10, 10, 0.6) 55%, var(--sub2-home-bg));
  inset: auto 0 0;
  height: 320px;
}

.sub2-hero-content {
  z-index: 10;
  display: grid;
  padding: 160px 0;
  align-items: center;
  grid-template-columns: 60fr 40fr;
  gap: 80px;
}

.sub2-hero-left {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 40px;
}

.sub2-hero-enter-top {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 16px;
}

.sub2-hero-kicker {
  max-width: 100%;
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--sub2-home-text);
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
}

.sub2-hero h1 {
  max-width: 100%;
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--sub2-home-text);
  font-family: var(--sub2-home-font-sans);
  font-size: 46px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0;
}

.sub2-hero-enter-mid {
  display: flex;
  max-width: 560px;
  flex-direction: column;
  gap: 8px;
}

.sub2-hero-enter-mid p {
  margin: 0;
  color: var(--sub2-home-text-muted);
  font-size: 16px;
  line-height: 1.6;
}

.sub2-hero-actions {
  display: flex;
  margin-top: 9px;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.sub2-btn {
  display: inline-flex;
  min-height: 36px;
  padding: 8px 16px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  text-decoration: none;
}

.sub2-hero-right {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  flex-direction: column;
  gap: 12px;
}

.sub2-code-tabs {
  display: flex;
  margin-left: 6px;
  padding: 0 4px;
  gap: 4px;
}

.sub2-code-tab {
  padding: 8px 16px;
  border: 1px solid transparent;
  border-bottom: 0;
  border-radius: 8px 8px 0 0;
  background: transparent;
  color: var(--sub2-home-text-muted);
  font: 500 13px/1.5 inherit;
}

.sub2-code-tab.active {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
  color: var(--sub2-home-text);
  backdrop-filter: blur(24px);
}

.sub2-hero-codebox {
  width: 100%;
  margin-top: -13px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(24px);
}

.sub2-codebox-header {
  display: flex;
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--sub2-home-border-soft);
}

.sub2-traffic-lights {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.sub2-tl {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.sub2-tl-red { background: #ff5f57; }
.sub2-tl-yellow { background: #febc2e; }
.sub2-tl-green { background: #28c840; }

.sub2-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: var(--sub2-home-text-muted);
  font: 400 12px/18px inherit;
}

.sub2-codebox-body {
  min-height: 94px;
  padding: 24px;
}

.sub2-codebox-body pre {
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--sub2-home-text);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  line-height: 1.625;
  white-space: pre-wrap;
}

.sub2-command-prompt {
  color: var(--sub2-home-blue);
}

@media (min-width: 768px) {
  .sub2-container,
  .sub2-header-wrapper {
    width: min(calc(100% - 144px), 1140px);
  }
}

@media (min-width: 1560px) {
  .sub2-header-wrapper {
    width: min(calc(100% - 160px), 1280px);
  }
}

@media (max-width: 767px) {
  .sub2-header-bar.is-scrolled {
    margin: 0;
  }

  .sub2-hero {
    height: auto;
    max-height: none;
  }

  .sub2-hero-content {
    padding: 120px 0 90px;
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .sub2-hero-right {
    width: min(100%, 680px);
  }
}

@media (max-width: 767px) {
  .sub2-logo-name {
    max-width: 32vw;
    font-size: 18px;
  }

  .sub2-harness-tag-inner {
    padding-inline: 7px;
    font-size: 9px;
  }

  .sub2-lang-btn {
    padding-inline: 9px;
  }

  .sub2-hero h1 {
    font-size: 36px;
  }

  .sub2-hero-kicker {
    font-size: 16px;
    line-height: 1.35;
  }

  .sub2-hero-actions {
    align-items: flex-start;
  }

  .sub2-btn {
    width: auto;
  }

  .sub2-code-tabs {
    max-width: 100%;
    overflow-x: auto;
  }

  .sub2-code-tab {
    white-space: nowrap;
  }
}

.sub2-section {
  position: relative;
  width: 100%;
  padding: 120px 0;
  background: var(--sub2-home-bg);
}

.sub2-features-section {
  padding: 80px 0 160px;
}

.sub2-title-block {
  display: flex;
  max-width: 820px;
  margin: 0 auto;
  align-items: center;
  flex-direction: column;
  gap: 32px;
  text-align: center;
}

.sub2-grad-pill {
  display: inline-flex;
  padding: 1px;
  align-items: center;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.08) 35%, rgba(255, 255, 255, 0.04) 65%, rgba(255, 255, 255, 0.28));
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.08), 0 0 32px rgba(255, 255, 255, 0.04);
}

.sub2-kicker-inner {
  display: inline-block;
  padding: 6px 9px 5px;
  border-radius: 7px;
  background: rgba(0, 0, 0, 0.25);
  color: rgba(255, 255, 255, 0.95);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.sub2-title-block h2,
.sub2-workflow-title h2,
.sub2-provider-heading h2,
.sub2-cta-section h2 {
  margin: 0;
  color: var(--sub2-home-text);
  font-family: var(--sub2-home-font-sans);
  font-size: 36px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0;
}

.sub2-font-harness {
  display: inline-block;
  color: var(--sub2-home-blue);
  font-family: var(--sub2-home-font-sans);
  font-size: 50px;
  line-height: 1;
  text-transform: uppercase;
  vertical-align: baseline;
}

.sub2-section-subs {
  display: flex;
  max-width: 760px;
  flex-direction: column;
}

.sub2-section-subs p {
  margin: 0;
  color: var(--sub2-home-text-muted);
  font-size: 16px;
  line-height: 1.75;
  text-align: center;
}

.sub2-feature-grid {
  display: grid;
  margin-top: 56px;
  align-items: stretch;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.sub2-feature-card {
  display: flex;
  height: 100%;
  min-height: 340px;
  padding: 32px;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--sub2-home-border-soft);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  text-align: center;
}

.sub2-feature-card:hover {
  border-color: var(--sub2-home-border-soft);
  background: rgba(255, 255, 255, 0.02);
}

.sub2-feature-icon {
  display: flex;
  width: 72px;
  height: 72px;
  margin-bottom: 16px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--sub2-home-text);
  opacity: 0.7;
}

.sub2-feature-icon svg {
  width: 54px;
  height: 54px;
}

.sub2-feature-card h3 {
  margin: 0 0 8px;
  color: var(--sub2-home-text);
  font: 400 18px/1.5 var(--sub2-home-font-sans);
}

.sub2-feature-en {
  display: block;
  margin-bottom: 12px;
  color: var(--sub2-home-text-muted);
  font-family: var(--sub2-home-font-sans);
  font-size: 11px;
  line-height: 1.5;
}

.sub2-feature-card > p {
  min-height: 0;
  margin: 0;
  color: var(--sub2-home-text-muted);
  font-size: 14px;
  line-height: 1.65;
}

.sub2-workflow-title {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 16px;
}

.sub2-workflow-grid {
  display: grid;
  width: 100%;
  margin-top: 80px;
  grid-template-columns: 42fr 58fr;
  gap: 80px;
}

.sub2-workflow-list {
  display: flex;
  flex-direction: column;
}

.sub2-workflow-item {
  display: flex;
  min-height: 35vh;
  padding: 11vh 0;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  border: 0;
  background: transparent;
  color: var(--sub2-home-text-muted);
  font-family: inherit;
  text-align: left;
  opacity: 0.3;
  transition: opacity 500ms ease;
}

.sub2-workflow-item.active {
  opacity: 1;
}

.sub2-workflow-item-head {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--sub2-home-text);
}

.sub2-workflow-item-head strong {
  font-size: 22px;
  font-weight: 400;
  line-height: 1.5;
}

.sub2-workflow-item > span:last-child {
  color: var(--sub2-home-text-muted);
  font-size: 16px;
  line-height: 1.7;
}

.sub2-product-sticky {
  display: flex;
  flex-direction: column;
}

.sub2-product-frame {
  position: sticky;
  top: 258px;
  width: 100%;
  max-width: 760px;
  aspect-ratio: 8 / 5;
  overflow: hidden;
  border: 1px solid var(--sub2-home-border-soft);
  border-radius: 10px;
  background: #101113;
  color: var(--sub2-home-text-soft);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  container-type: inline-size;
}

.sub2-product-topbar {
  display: grid;
  height: 52px;
  padding: 0 18px;
  align-items: center;
  border-bottom: 1px solid var(--sub2-home-border-soft);
  grid-template-columns: 1fr auto 1fr;
}

.sub2-product-topbar > span {
  display: flex;
  gap: 7px;
}

.sub2-product-topbar i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
}

.sub2-product-topbar small {
  color: var(--sub2-home-text-muted);
  font-family: var(--sub2-home-font-sans);
  font-size: 9px;
}

.sub2-product-topbar em {
  justify-self: end;
  color: var(--sub2-home-green);
  font-size: 9px;
  font-style: normal;
}

.sub2-product-route {
  display: flex;
  height: calc(100% - 52px);
  padding: clamp(12px, 4cqw, 34px);
  justify-content: center;
  flex-direction: column;
  gap: clamp(10px, 4cqw, 34px);
}

.sub2-product-request,
.sub2-product-response {
  padding: 14px 16px;
  border: 1px solid var(--sub2-home-border-soft);
  border-radius: 7px;
  background: rgba(0, 0, 0, 0.24);
  font-size: 12px;
}

.sub2-product-request b {
  color: var(--sub2-home-blue);
  font-weight: 500;
}

.sub2-product-path {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 9px;
}

.sub2-product-path span {
  padding: 7px 9px;
  border: 1px solid var(--sub2-home-border);
  border-radius: 5px;
}

.sub2-product-path span.active {
  border-color: rgba(103, 153, 254, 0.42);
  background: rgba(103, 153, 254, 0.14);
  color: #abc4ff;
}

.sub2-product-path i {
  width: 32px;
  height: 1px;
  background: linear-gradient(90deg, var(--sub2-home-border), var(--sub2-home-blue));
}

.sub2-product-response {
  color: var(--sub2-home-green);
}

.sub2-product-response small {
  float: right;
  color: var(--sub2-home-text-muted);
}

.sub2-product-accounts {
  display: grid;
  height: calc(100% - 52px);
  padding: clamp(10px, 3cqw, 24px);
  align-content: center;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: clamp(5px, 1.5cqw, 10px);
}

.sub2-product-accounts > div {
  display: flex;
  min-height: 0;
  padding: clamp(4px, 1.5cqw, 10px);
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  border: 1px solid var(--sub2-home-border-soft);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.025);
}

.sub2-product-accounts span {
  font-size: 10px;
}

.sub2-product-accounts small {
  color: var(--sub2-home-text-muted);
  font-size: 7px;
}

.sub2-product-accounts > div.active small {
  color: var(--sub2-home-green);
}

.sub2-product-usage {
  display: flex;
  height: calc(100% - 52px);
  padding: clamp(10px, 4cqw, 30px);
  flex-direction: column;
  gap: clamp(8px, 4cqw, 28px);
}

.sub2-usage-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.sub2-usage-summary > span {
  display: flex;
  padding: clamp(5px, 2cqw, 13px);
  flex-direction: column;
  gap: 5px;
  border: 1px solid var(--sub2-home-border-soft);
  border-radius: 6px;
}

.sub2-usage-summary small {
  color: var(--sub2-home-text-muted);
  font-size: 7px;
}

.sub2-usage-summary b {
  color: var(--sub2-home-text);
  font-size: 13px;
  font-weight: 500;
}

.sub2-usage-chart {
  display: flex;
  min-height: 0;
  flex: 1;
  align-items: end;
  gap: 7px;
  border-bottom: 1px solid var(--sub2-home-border-soft);
}

.sub2-usage-chart i {
  width: 100%;
  border-radius: 3px 3px 0 0;
  background: linear-gradient(rgba(103, 153, 254, 0.75), rgba(103, 153, 254, 0.12));
}

.sub2-providers-section {
  border-color: var(--sub2-home-border-soft);
  background: var(--sub2-home-bg);
}

.sub2-provider-heading {
  display: flex;
  max-width: 760px;
  margin: 0 auto;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  text-align: center;
}

.sub2-provider-heading > p {
  margin: 0;
}

.sub2-provider-list {
  margin-top: 80px;
  overflow: hidden;
  border: 1px solid var(--sub2-home-border-soft);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
}

.sub2-cta-section {
  display: flex;
  position: relative;
  min-height: min(60vh, 720px);
  padding: 160px 0 240px;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
  background: linear-gradient(180deg, #0a0a0a 0%, #0b1018 54%, #0a0a0a 100%);
  text-align: center;
}

.sub2-cta-ambient {
  position: absolute;
  inset: 4% -12% 0;
  z-index: 0;
  background: none;
  opacity: 1;
  filter: none;
  mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 72%, transparent 100%);
  pointer-events: none;
  transform: scale(1.08);
}

.sub2-cta-topography {
  position: absolute;
  inset: 0;
  pointer-events: auto;
}

.sub2-cta-inner {
  position: relative;
  z-index: 2;
  display: flex;
  max-width: 820px;
  align-items: center;
  flex-direction: column;
  gap: 24px;
}

.sub2-cta-inner > p {
  max-width: 652px;
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
}

.sub2-cta-actions {
  margin-top: 8px;
  justify-content: center;
}

@media (max-width: 767px) {
  .sub2-feature-grid,
  .sub2-workflow-grid {
    grid-template-columns: 1fr;
  }

  .sub2-workflow-grid {
    gap: 48px;
  }

  .sub2-workflow-item {
    min-height: 0;
    padding: 48px 0;
  }

  .sub2-product-frame {
    position: static;
    max-width: none;
  }
}

@media (max-width: 767px) {
  .sub2-features-section {
    padding: 72px 0 96px;
  }

  .sub2-hero {
    min-height: 100svh;
  }

  .sub2-title-block {
    gap: 24px;
  }

  .sub2-title-block h2,
  .sub2-workflow-title h2,
  .sub2-provider-heading h2,
  .sub2-cta-section h2 {
    font-size: 28px;
  }

  .sub2-font-harness {
    font-size: 34px;
  }

  .sub2-feature-card {
    min-height: 0;
  }

  .sub2-workflow-grid,
  .sub2-provider-list {
    margin-top: 48px;
  }

  .sub2-product-path i {
    width: 16px;
  }

  .sub2-usage-summary {
    grid-template-columns: 1fr;
  }

  .sub2-usage-summary > span:nth-child(n + 2) {
    display: none;
  }

  .sub2-cta-section {
    min-height: 560px;
    padding: 120px 0 160px;
  }

  .sub2-cta-ambient {
    inset: 8% -48% 0;
  }

}

.sub2-lang-btn {
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
}

.sub2-code-tab {
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 19.5px;
}

.sub2-copy-btn {
  font-family: inherit;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}

.sub2-workflow-item {
  opacity: 0.62;
}

.sub2-workflow-item.active {
  opacity: 1;
}

@media (max-width: 767px) {
  .sub2-lang-btn {
    padding-inline: 8px;
    font-size: 11px;
  }

  .sub2-code-tab {
    padding: 7px 13px;
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sub2-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .sub2-live i {
    animation: none;
  }

}
</style>
