/**
 * Talking-avatar media — drop files at these exact public paths.
 *
 *   public/avatar/david-intro.webm     13s voiced intro (cream field, no alpha)
 *   public/avatar/david-intro.mp4      intro fallback
 *   public/avatar/david-intro.vtt      captions for the spoken line
 *   public/avatar/david-talking.webm   12.4s silent loop (cream field, no alpha)
 *   public/avatar/david-talking.mp4    loop fallback
 *   public/avatar/poster.jpg           still / mobile poster
 *
 * The slot probes these URLs at runtime. Missing files keep the placeholder.
 * See `public/avatar/README.md`.
 */
/** Bump when replacing unhashed files in `public/avatar/`. */
const AVATAR_CACHE = 'v=4'

export const AVATAR_ASSETS = {
  introWebm: `/avatar/david-intro.webm?${AVATAR_CACHE}`,
  introMp4: `/avatar/david-intro.mp4?${AVATAR_CACHE}`,
  introCaptions: `/avatar/david-intro.vtt?${AVATAR_CACHE}`,
  loopWebm: `/avatar/david-talking.webm?${AVATAR_CACHE}`,
  loopMp4: `/avatar/david-talking.mp4?${AVATAR_CACHE}`,
  poster: `/avatar/poster.jpg?${AVATAR_CACHE}`,
  placeholderPortrait: '/david-portrait.png',
} as const

/** Spoken line in the intro — keep in sync with `david-intro.vtt`. */
export const AVATAR_INTRO_CAPTION =
  "Hi, I'm David. I'm a software developer. I build responsive web applications, interactive websites and AI-powered platforms."

export const AVATAR_CROSSFADE_MS = 400

/**
 * Intro grab cues from `david-intro` (13s). Hands rise ~4.05s, bar
 * must stay covered 4.80–6.30s, release ~6.70s.
 */
export const INTRO_FIX_START = 4.8
export const INTRO_FIX_STAGGER = 0.04
export const INTRO_FIX_END = 6.3
export const INTRO_DURATION = 13

export type AvatarIntroClock = {
  phase: 'poster' | 'intro' | 'loop'
  time: number
  hasIntro: boolean
  introFailed: boolean
  resetId: number
}

export const IDLE_INTRO_CLOCK: AvatarIntroClock = {
  phase: 'poster',
  time: 0,
  hasIntro: false,
  introFailed: false,
  resetId: 0,
}

export type AvatarSourcePick = { src: string; type: string }

/** Safari/WebKit often reports empty `canPlayType` for WebM — put MP4 first there. */
export function orderedVideoSources(
  webm: { ok: boolean; src: string },
  mp4: { ok: boolean; src: string },
): AvatarSourcePick[] {
  const preferMp4 =
    typeof document !== 'undefined' &&
    document.createElement('video').canPlayType('video/webm') === ''
  const picks: AvatarSourcePick[] = []
  const push = (item: { ok: boolean; src: string }, type: string) => {
    if (item.ok) picks.push({ src: item.src, type })
  }
  if (preferMp4) {
    push(mp4, 'video/mp4')
    push(webm, 'video/webm')
  } else {
    push(webm, 'video/webm')
    push(mp4, 'video/mp4')
  }
  return picks
}

export function markWebkitInline(el: HTMLVideoElement | null) {
  if (!el) return
  el.setAttribute('playsinline', '')
  el.setAttribute('webkit-playsinline', 'true')
  el.playsInline = true
}

export type AvatarSources = {
  introWebm: boolean
  introMp4: boolean
  loopWebm: boolean
  loopMp4: boolean
  poster: boolean
}

function isHtmlType(type: string): boolean {
  return type.includes('text/html')
}

function looksLikeVideo(bytes: Uint8Array): boolean {
  if (bytes.length >= 4 && bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return true
  }
  if (bytes.length >= 8) {
    const tag = String.fromCharCode(bytes[4]!, bytes[5]!, bytes[6]!, bytes[7]!)
    if (tag === 'ftyp') return true
  }
  return false
}

function looksLikeImage(bytes: Uint8Array): boolean {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return true
  }
  if (bytes.length >= 4) {
    const tag = String.fromCharCode(bytes[0]!, bytes[1]!, bytes[2]!, bytes[3]!)
    if (tag === 'RIFF') return true
  }
  return false
}

export async function probePublicAsset(url: string, kind: 'image' | 'video'): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-15' },
    })
    if (!res.ok && res.status !== 206) return false
    const type = (res.headers.get('content-type') || '').toLowerCase()
    if (isHtmlType(type)) return false
    if (kind === 'video' && type.startsWith('video/')) return true
    if (kind === 'image' && type.startsWith('image/')) return true
    const bytes = new Uint8Array(await res.arrayBuffer())
    return kind === 'video' ? looksLikeVideo(bytes) : looksLikeImage(bytes)
  } catch {
    return false
  }
}

export async function probeAvatarSources(): Promise<AvatarSources> {
  const [introWebm, introMp4, loopWebm, loopMp4, poster] = await Promise.all([
    probePublicAsset(AVATAR_ASSETS.introWebm, 'video'),
    probePublicAsset(AVATAR_ASSETS.introMp4, 'video'),
    probePublicAsset(AVATAR_ASSETS.loopWebm, 'video'),
    probePublicAsset(AVATAR_ASSETS.loopMp4, 'video'),
    probePublicAsset(AVATAR_ASSETS.poster, 'image'),
  ])
  return { introWebm, introMp4, loopWebm, loopMp4, poster }
}
