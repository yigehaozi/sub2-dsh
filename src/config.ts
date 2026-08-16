export interface SiteConfig {
  siteName: string
  siteSubtitle: string
  siteLogo: string
  primaryCtaUrl: string
  docsUrl: string
}

export const ORIGIN_REPOSITORY_URL = 'https://github.com/yigehaozi/sub2-dsh'

const DEFAULT_CONFIG = {
  siteName: 'JGY.AI',
  siteSubtitle: 'AI API Gateway Platform',
  primaryCtaUrl: 'https://jgy.ai/login',
  docsUrl: '',
} satisfies Omit<SiteConfig, 'siteLogo'>

function toHttpUrl(value: string | undefined): string | undefined {
  if (!value) return undefined

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? value : undefined
  } catch {
    return undefined
  }
}

function toBasePath(baseUrl: string): string {
  const withLeadingSlash = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

export function createSiteConfig(env: ImportMetaEnv, baseUrl = env.BASE_URL || '/'): SiteConfig {
  const basePath = toBasePath(baseUrl)

  return {
    siteName: env.VITE_SITE_NAME?.trim() || DEFAULT_CONFIG.siteName,
    siteSubtitle: env.VITE_SITE_SUBTITLE?.trim() || DEFAULT_CONFIG.siteSubtitle,
    siteLogo: toHttpUrl(env.VITE_SITE_LOGO) || `${basePath}logo.png`,
    primaryCtaUrl: toHttpUrl(env.VITE_PRIMARY_CTA_URL) || DEFAULT_CONFIG.primaryCtaUrl,
    docsUrl: toHttpUrl(env.VITE_DOCS_URL) || DEFAULT_CONFIG.docsUrl,
  }
}

export const siteConfig: SiteConfig = createSiteConfig(import.meta.env)
