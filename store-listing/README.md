# Store listing import (Partner Center)

Folder for **Store listings → Import listings → Upload folder**. Contains one `listing.csv` (UTF-8) and localized 1920×1080 screenshots for `es-es`, `en-us` and `ca-es`.

- Upload this whole `store-listing` folder; image paths in the CSV start with `store-listing/`.
- The package declares only Spanish, so `en-us` and `ca-es` are added as extra Store listing languages. The CSV can create them, or add them first via **Add/remove languages**.
- Field IDs follow Partner Center's export format. If the import reports an unknown field or ID, export the listing from Partner Center and copy the language columns into that file.
- Regenerate screenshots after UI changes (see `screenshots/` scripts in the project thread).
