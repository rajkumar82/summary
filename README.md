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
