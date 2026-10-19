# Talking avatar media

Drop the hero talking-avatar files here (same filenames). The site is a static `dist` build — upload this folder next to `index.html` on shared hosting, or add the files before `npm run build`.

| File | Required | Notes |
| --- | --- | --- |
| `david-talking.webm` | Preferred | Transparent / alpha WebM (VP8/VP9 + alpha). Used first on capable browsers. |
| `david-talking.mp4` | Fallback | H.264 when WebM is missing or unsupported. |
| `poster.jpg` | Optional | Still frame for first paint and for mobile / Save-Data (no heavy autoplay). |

Public URLs after deploy:

- `/avatar/david-talking.webm`
- `/avatar/david-talking.mp4`
- `/avatar/poster.jpg`

Until at least one video file is present, the hero shows a tasteful portrait placeholder. The slot does **not** autoplay on coarse pointers (touch) or when the browser reports Save-Data; those visitors get the poster (or the placeholder) and can tap to play if a video exists.

Suggested export: muted, looping, ~4–8s, 512–720px tall, no audio track. Keep the file under ~2 MB if you can.
