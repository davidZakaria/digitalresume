import gripTrack from '../data/introGripTrack.json'

export type GripPoint = { x: number; y: number }

export type GripBar = {
  left: GripPoint
  right: GripPoint
  barLeft: GripPoint
  barRight: GripPoint
  cx: number
  cy: number
  angle: number
  width: number
  height: number
  box: { x: number; y: number; w: number; h: number }
}

export type GripFrame = { t: number; bar: GripBar }

export const GRIP_TRACK = gripTrack as {
  duration: number
  cover: { start: number; end: number }
  grab: { start: number; end: number }
  handsUp: number
  release: number
  frames: GripFrame[]
}

export const INTRO_DURATION = 13
export const GRIP_COVER_START = GRIP_TRACK.cover.start
export const GRIP_COVER_END = GRIP_TRACK.cover.end
export const GRIP_GRAB_START = GRIP_TRACK.grab.start
export const GRIP_RELEASE = GRIP_TRACK.release
export const GRIP_HANDS_UP = GRIP_TRACK.handsUp

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerpBar(a: GripBar, b: GripBar, t: number): GripBar {
  const mix = (pa: GripPoint, pb: GripPoint): GripPoint => ({
    x: lerp(pa.x, pb.x, t),
    y: lerp(pa.y, pb.y, t),
  })
  return {
    left: mix(a.left, b.left),
    right: mix(a.right, b.right),
    barLeft: mix(a.barLeft, b.barLeft),
    barRight: mix(a.barRight, b.barRight),
    cx: lerp(a.cx, b.cx, t),
    cy: lerp(a.cy, b.cy, t),
    angle: lerp(a.angle, b.angle, t),
    width: lerp(a.width, b.width, t),
    height: lerp(a.height, b.height, t),
    box: {
      x: lerp(a.box.x, b.box.x, t),
      y: lerp(a.box.y, b.box.y, t),
      w: lerp(a.box.w, b.box.w, t),
      h: lerp(a.box.h, b.box.h, t),
    },
  }
}

export function firstGripBar(): GripBar {
  return GRIP_TRACK.frames[0]!.bar
}

export function lastGripBar(): GripBar {
  return GRIP_TRACK.frames[GRIP_TRACK.frames.length - 1]!.bar
}

export function sampleGripBar(time: number): GripBar | null {
  const frames = GRIP_TRACK.frames
  if (frames.length === 0) return null
  if (time <= frames[0]!.t) return frames[0]!.bar
  if (time >= frames[frames.length - 1]!.t) return frames[frames.length - 1]!.bar
  for (let i = 1; i < frames.length; i += 1) {
    const prev = frames[i - 1]!
    const next = frames[i]!
    if (time <= next.t) {
      const span = next.t - prev.t
      const u = span <= 0 ? 1 : (time - prev.t) / span
      return lerpBar(prev.bar, next.bar, u)
    }
  }
  return frames[frames.length - 1]!.bar
}

export function easeInOut(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/** Resting headline sits on the lower video so hands meet it as they rise. */
export const HEADLINE_REST = { cx: 0.5, cy: 0.86, width: 1.2, rotate: -6.5 }
export const HEADLINE_SETTLED = { cx: 0.5, cy: 0.9, width: 1.2, rotate: 0 }

export const GRIP_APPROACH_START = 3.7
export const GRIP_STRAIGHTEN_END = 5.35
export const GRIP_SETTLE_END = 7.2
const COVER_FADE = 0.12

export type HeadlinePose = {
  cx: number
  cy: number
  width: number
  rotate: number
  cover: number
  grabbing: boolean
  released: boolean
  lettersFixed: boolean
}

export type CoverMask = { x: number; y: number; w: number; h: number }

function gripWidth(bar: GripBar): number {
  return Math.max(0.28, Math.hypot(bar.right.x - bar.left.x, bar.right.y - bar.left.y))
}

function poseFromBar(bar: GripBar, rotate: number) {
  return {
    cx: (bar.left.x + bar.right.x) / 2,
    cy: (bar.left.y + bar.right.y) / 2,
    // Span the grips, but stay wide enough that the letters cover the rod.
    width: Math.max(gripWidth(bar), bar.width * 0.88),
    rotate,
  }
}

function mixPose(
  a: { cx: number; cy: number; width: number; rotate: number },
  b: { cx: number; cy: number; width: number; rotate: number },
  t: number,
) {
  const u = easeInOut(t)
  return {
    cx: lerp(a.cx, b.cx, u),
    cy: lerp(a.cy, b.cy, u),
    width: lerp(a.width, b.width, u),
    rotate: lerp(a.rotate, b.rotate, u),
  }
}

export function coverMaskFor(bar: GripBar): CoverMask {
  const padX = 0.055
  const padY = 0.08
  const minH = 0.36
  const w = Math.max(bar.box.w + padX * 2, 0.82)
  const h = Math.max(bar.box.h + padY * 2, minH)
  return {
    x: Math.min(bar.box.x - padX, 0.06),
    y: bar.cy - h * 0.48,
    w,
    h,
  }
}

export function coverAmount(time: number): number {
  if (time < GRIP_COVER_START - COVER_FADE) return 0
  if (time < GRIP_COVER_START) return easeInOut((time - (GRIP_COVER_START - COVER_FADE)) / COVER_FADE)
  if (time <= GRIP_COVER_END) return 1
  if (time < GRIP_COVER_END + COVER_FADE) return 1 - easeInOut((time - GRIP_COVER_END) / COVER_FADE)
  return 0
}

export function resolveHeadlinePose(
  time: number,
  phase: 'poster' | 'intro' | 'loop',
): HeadlinePose {
  if (phase === 'poster') {
    return { ...HEADLINE_REST, cover: 0, grabbing: false, released: false, lettersFixed: false }
  }
  if (phase === 'loop') {
    return { ...HEADLINE_SETTLED, cover: 0, grabbing: false, released: true, lettersFixed: true }
  }

  const first = firstGripBar()
  const live = sampleGripBar(time) ?? first
  const meet = poseFromBar(first, -6.5)
  const cover = coverAmount(time)
  const grabbing = time >= GRIP_GRAB_START && time < GRIP_RELEASE
  const released = time >= GRIP_RELEASE
  const lettersFixed = released
  const straighten = easeInOut((time - GRIP_GRAB_START) / (GRIP_STRAIGHTEN_END - GRIP_GRAB_START))

  if (time < GRIP_APPROACH_START) {
    return { ...HEADLINE_REST, cover, grabbing, released, lettersFixed }
  }

  if (time < GRIP_GRAB_START) {
    const u = (time - GRIP_APPROACH_START) / (GRIP_GRAB_START - GRIP_APPROACH_START)
    return { ...mixPose(HEADLINE_REST, meet, u), cover, grabbing, released, lettersFixed }
  }

  if (time < GRIP_RELEASE) {
    const held = poseFromBar(live, lerp(-6.5, live.angle, straighten))
    return { ...held, cover, grabbing, released, lettersFixed }
  }

  const heldLast = poseFromBar(live, live.angle)
  if (time < GRIP_SETTLE_END) {
    const u = (time - GRIP_RELEASE) / (GRIP_SETTLE_END - GRIP_RELEASE)
    return { ...mixPose(heldLast, HEADLINE_SETTLED, u), cover, grabbing, released, lettersFixed }
  }

  return { ...HEADLINE_SETTLED, cover, grabbing, released, lettersFixed }
}
