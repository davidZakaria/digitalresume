# Talking avatar media

Files in this folder ship with the static `dist` build. Replace them in place (same filenames) if you re-export.

| File | Role |
| --- | --- |
| `david-intro.webm` | Voiced intro, 7.5s. **Not alpha** — same cream field and framing as the loop. |
| `david-intro.mp4` | H.264 fallback for the intro. |
| `david-intro.vtt` | Captions for the spoken line. |
| `david-talking.webm` | Silent loop. **Not alpha** — 1280×720, muted, 12.4s forward-then-reverse. |
| `david-talking.mp4` | H.264 fallback for the loop. |
| `poster.jpg` | Still frame for first paint and for mobile / Save-Data / reduced motion. |

Public URLs after deploy:

- `/avatar/david-intro.webm`
- `/avatar/david-intro.mp4`
- `/avatar/david-intro.vtt`
- `/avatar/david-talking.webm`
- `/avatar/david-talking.mp4`
- `/avatar/poster.jpg`

Playback:

- **Desktop:** intro autoplays once **muted** (browsers block autoplay-with-sound). A “Tap for sound” pill unmutes and restarts the intro. When it ends, a ~400ms crossfade goes to the silent loop. Replay intro is available after that.
- **Mobile / Save-Data / reduced motion:** poster + play button. Tap plays the intro **with sound**, then the loop. No autoplay.

The hero feathers the baked cream field with CSS `mask-image`. Dark theme uses a rounded spotlight stage so it never reads as a hard cream box.

Spoken line: “Hi, I'm David. I'm a software developer. I build responsive web applications, interactive websites and AI-powered platforms.”
