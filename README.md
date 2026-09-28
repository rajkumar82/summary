# Summary

A static page with my photo and my hobby projects as tappable cards (icon, title, one-line description, link),
newest first. Mobile-first, follows the phone's light/dark setting. Hosted from a public Cloud Storage bucket,
no server.

Live: https://storage.googleapis.com/rajkumar-summary/index.html

To add a project, copy a card `<li>` in `index.html` to the top of the list, move the "New" badge onto it (only the
first card has one) and bump the count in the "Projects" heading. Then upload it (together with `photo.jpg` and
the icons if they changed):

    gcloud storage cp index.html gs://rajkumar-summary/index.html --content-type="text/html; charset=utf-8" --cache-control="no-cache"

The bucket has no lifecycle rule on purpose (the clipboard bucket deletes objects after 3 days).

## Installable (PWA)

The page can be added to the home screen via the ⋮ menu (`install.js`). Because this is a static bucket site with
no domain root of its own (it's served under a bucket path prefix on storage.googleapis.com), every path here is
relative — `install.js` registers `sw.js` as `'sw.js'`, not `'/sw.js'`, and `manifest.webmanifest`'s `start_url`/
icon paths are relative too. All PWA files (`manifest.webmanifest`, `sw.js`, `install.js`, `icon-*.png`) must sit
next to `index.html` at the bucket root, so upload the whole directory, not just `index.html`:

    gcloud storage cp index.html manifest.webmanifest sw.js install.js icon-192.png icon-512.png icon-maskable-512.png photo.jpg favicon.png apple-touch-icon.png gs://rajkumar-summary/ --cache-control="no-cache"

Bump `CACHE` in `sw.js` when any shell file changes in a way that must not be served stale.
