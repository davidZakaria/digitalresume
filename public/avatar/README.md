# Talking avatar media

Files in this folder ship with the static `dist` build. Replace them in place (same filenames) if you re-export the loop.

| File | Role |
| --- | --- |
| `david-talking.webm` | Preferred loop. **Not alpha** — baked cream field + soft radial gradient, 1280×720, muted, 12.4s forward-then-reverse. |
| `david-talking.mp4` | H.264 fallback of the same cream-backed loop. |
| `poster.jpg` | Still frame for first paint and for mobile / Save-Data (no heavy autoplay). |

Public URLs after deploy:

- `/avatar/david-talking.webm`
- `/avatar/david-talking.mp4`
- `/avatar/poster.jpg`

The hero does **not** rely on a transparent WebM. Edges are feathered with CSS `mask-image` so the cream field dissolves into the light hero. Dark theme sits the same masked media on a rounded spotlight stage so it never reads as a hard cream box.

The slot does **not** autoplay on coarse pointers (touch) or when the browser reports Save-Data; those visitors get the poster and can tap to play.

Current export: muted, looping, 12.4s forward-then-reverse, 1280×720, no audio track.
