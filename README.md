# Production Center Training

Static employee training site for the production center. Five videos play in order, then a name / signature / date sign-off. Plain HTML, CSS, and JavaScript. No build step. It can be hosted on GitHub Pages.

This is a separate site from the retail training. It does not read or write the retail site's saved progress.

## Setup

1. Edit `config.js`.
   - `TITLES` — the heading on each video page. Defaults are `Video 1` through `Video 5`.
   - `VIDEOS` — paste a YouTube link, a Vimeo link, or an MP4 link. Leave `""` until you have it.
   - `FORMSPREE_URL` — where the sign-off is sent. It already points at the same Formspree form as the retail site (`https://formspree.io/f/mjyylepr`) so the same owner is notified. Change it only if these sign-offs should go somewhere else.
   - `TEST_MODE` — leave `false`. Set it to `true` only for a dry run; a red button then marks a video watched without playing it. Empty links still do not unlock. Set it back to `false` before trainees use the site.
   - `SITE_KEY` — leave `production`. That prefix keeps this site's saved progress off the retail site's keys.
2. For an MP4 file, put the file in this same folder and set the value to the file name, for example `"safety.mp4"`. You can also paste a full `https://` URL. Names are case-sensitive on GitHub Pages.
3. Preview on your computer with a small web server (do not open the files by double-clicking):

   ```bash
   python3 -m http.server 8741
   ```

   Then open `http://127.0.0.1:8741`.

   Python's built-in server does not send byte ranges. In Chrome, an MP4 on that server can play from the start (and still unlocks Next at the end) but the playhead cannot be moved, so resume and the no-skip snap cannot be previewed there. GitHub Pages does send byte ranges, and that is where seeking, resume, and the forward-lock behave as described below.
4. To publish on GitHub Pages, push this folder as the site root and set Pages to deploy from the branch root. There is no build command. `.nojekyll` is included so Pages serves the files as-is.

There are exactly five video pages: `video1.html` through `video5.html`. The last one continues to `signoff.html`. After Formspree accepts the form, the trainee is sent to `done.html`.

## How the pages behave

- The welcome page links to Video 1.
- The next button stays locked until that video reaches the end.
- Back always works. Earlier videos stay available.
- The footer bar counts videos finished in this tab. It reads "Training complete" after a successful sign-off.
- Sign-off asks for full name, a typed signature, and the date. It is sent with `fetch`. The site marks the trainee finished only when Formspree returns a successful response, then opens `done.html` with: "You completed this segment of your training! You can safely close this page now."
- Opening `signoff.html` or a later video before the earlier ones are finished sends the trainee to the first unfinished video.
- A hidden `_subject` field labels the email "Production Center training sign-off" so it is easy to tell apart from a retail sign-off in the same inbox.

## Privacy

Watched videos and playback position stay in the browser's `sessionStorage`. This site does not upload that progress.

The sign-off form sends the full name, typed signature, and date to Formspree at the address in `config.js`. Formspree delivers that to the form owner. That is the only data this site submits. There is no account and no analytics script.

## No-skip is client-side only

For an HTML5 MP4 or other file video, the page remembers the furthest point actually played. The playhead cannot be moved forward past that point, and playback faster than 1x is put back to normal, until the video ends. Rewinding is allowed. After it ends, the controls work normally so the trainee can review.

This is not a security control:

- Anyone can bypass it with browser developer tools, by editing `sessionStorage`, or by opening the video file directly.
- YouTube and Vimeo videos play inside those companies' players. This page cannot stop seeking or speed changes there. Use an MP4 when the no-skip behavior matters.
- Some browsers may flash the later frame for a moment before the playhead snaps back.

An empty `VIDEOS` entry shows "Video N link not added yet" and does not unlock Next, including in test mode.

## sessionStorage caveat

Progress lasts for this browser tab's session. It is not an account record.

- Closing the tab, or starting a new tab, starts over. Progress is not shared across devices or browsers.
- A full browser quit usually clears it. Some browsers restore previous tabs and their `sessionStorage` when reopening a saved session ("continue where you left off", or restoring a crashed window). A restored tab can show the old video position or a finished sign-off even after a restart. That is the browser putting the old tab back, not the website storing a permanent record.
- Restored pages can also show a stale button state until the tab is reloaded.
- Trainees should finish in the same tab. Do not treat the progress bar as proof for a personnel file; the Formspree email is the sign-off record.
- Retail training uses different keys (`video1_done`, `signoff_done`, and so on). This site uses `production_video1_done`, `production_video1_pos`, and `production_signoff_done`. Opening one site does not advance the other.
# Production-Center-Training-Website
