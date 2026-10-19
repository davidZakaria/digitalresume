/**
 * Talking-avatar media — drop files at these exact public paths.
 *
 *   public/avatar/david-talking.webm   preferred (alpha / VP9 or VP8)
 *   public/avatar/david-talking.mp4    fallback
 *   public/avatar/poster.jpg           still / mobile poster
 *
 * The slot probes these URLs at runtime. Missing files keep the placeholder.
 * See `public/avatar/README.md`.
 */
export const AVATAR_ASSETS = {
  webm: '/avatar/david-talking.webm',
  mp4: '/avatar/david-talking.mp4',
  poster: '/avatar/poster.jpg',
  placeholderPortrait: '/david-portrait.png',
} as const

export type AvatarSources = {
  webm: boolean
  mp4: boolean
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
  const [webm, mp4, poster] = await Promise.all([
    probePublicAsset(AVATAR_ASSETS.webm, 'video'),
    probePublicAsset(AVATAR_ASSETS.mp4, 'video'),
    probePublicAsset(AVATAR_ASSETS.poster, 'image'),
  ])
  return { webm, mp4, poster }
}
