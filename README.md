# Tab Counter & Organizer

A tiny Chrome/Edge extension that shows how many tabs you have open, breaks them down by site, and lets you close duplicates or group tabs by domain in one click.

## Install (unpacked, ~30 seconds)

1. Unzip this folder somewhere permanent (don't delete it after installing — Chrome loads the extension from these files).
2. Open `chrome://extensions` in your browser.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `tab-organizer` folder.
5. Pin the extension (puzzle-piece icon in the toolbar → pin) so it's always visible.
6. Click the icon to see your tab count and site breakdown.

Works the same way in Edge via `edge://extensions`.

## Features

- **Live tab count** across all open windows
- **Breakdown by domain** — see which sites are eating your tabs
- **Close duplicates** — removes tabs with an identical URL, keeping one
- **Group by site** — uses Chrome's native tab groups to bundle tabs from the same domain (only groups domains with 2+ open tabs)

## Note

- No data leaves your browser — everything runs locally via the `chrome.tabs` API.
- "Group by site" only affects the current window.
- If you want an icon in the toolbar/extensions page, drop a 128x128 `icon.png` into this folder and add it back to `manifest.json`'s `icons` field.
