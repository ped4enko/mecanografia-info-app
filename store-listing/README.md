# Store listing import (Partner Center)

Folder for **Store listings → Import listings → Upload folder**. Contains one `listing.csv` (UTF-8, built on top of the Partner Center export, language columns `es`, `ca-es`, `en`) and localized 1920×1080 screenshots in `images/es-es`, `images/ca-es`, `images/en-us`.

- Upload this whole `store-listing` folder; image paths in the CSV start with `store-listing/`.
- The package declares only Spanish, so `en` and `ca-es` are added as extra Store listing languages. The CSV can create them, or add them first via **Add/remove languages**.
- Field names and IDs come from the real export of product 9MTGZL7G21VP. Spanish keeps the existing screenshot in slot 1; new screenshots start at slot 2.
- Regenerate screenshots after UI changes (see `screenshots/` scripts in the project thread).
