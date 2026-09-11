/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIVE_HRERP_URL?: string
  readonly VITE_LIVE_TALE_URL?: string
  /** Canonical site URL for SEO JSON-LD (no trailing slash), e.g. https://yoursite.com */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
