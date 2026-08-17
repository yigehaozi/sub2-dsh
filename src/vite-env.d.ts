// SPDX-License-Identifier: LGPL-3.0-or-later
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_NAME?: string
  readonly VITE_SITE_SUBTITLE?: string
  readonly VITE_SITE_LOGO?: string
  readonly VITE_PRIMARY_CTA_URL?: string
  readonly VITE_DOCS_URL?: string
  readonly VITE_BASE_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
