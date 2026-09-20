# Summary

A static page listing my hobby projects (title + link). Hosted from a public Cloud Storage bucket, no server.

Live: https://storage.googleapis.com/clipboard-509110-summary/index.html

To add a project, add an `<li>` to `index.html`, then upload it:

    gcloud storage cp index.html gs://clipboard-509110-summary/index.html --content-type="text/html; charset=utf-8" --cache-control="no-cache"

The bucket has no lifecycle rule on purpose (the clipboard bucket deletes objects after 3 days).
