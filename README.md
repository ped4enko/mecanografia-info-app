# Mecanografía Info — PWA для Microsoft Store

Офлайн-тренажер сліпого друку іспанською на основі [mecanografia.info](https://mecanografia.info/), зібраний як Progressive Web App і готовий до пакування в MSIX через [PWABuilder](https://www.pwabuilder.com/) для продукту Microsoft Store `9MTGZL7G21VP`.

## Можливості

- **Práctica** — тексти з тильдами, ñ, ¿ ¡, діерезисом; живі PPM, точність, час, рівень.
- **Test 1 min** — хвилинний тест швидкості.
- **Niños** — короткі прості речення для дітей.
- **Sin tildes** — ті самі тексти без наголосів (ñ зберігається).
- **Estadísticas** — найкращий і середній PPM, графік останніх сесій (зберігається лише локально).
- Екранна клавіатура ES (ISO) або US з кольорами за пальцями та підказкою мертвої клавіші ´ для наголошених голосних.
- Інтерфейс ES / EN / CA, світла і темна тема, працює повністю офлайн.
- Window Controls Overlay для встановленої Windows-програми, ярлики (Test, Niños, Estadísticas) у меню «Пуск».

## Структура

```
index.html             головна сторінка
css/styles.css         стилі (світла/темна тема)
js/app.js              логіка тренажера, статистика, реєстрація SW
js/texts.js            тексти для вправ
js/keyboard.js         розкладки клавіатури та пальці
js/i18n.js             переклади інтерфейсу
sw.js                  service worker (офлайн-кеш)
manifest.webmanifest   маніфест PWA
icons/                 іконки (any + maskable) з фавікона mecanografia.info
screenshots/           скриншоти для маніфесту і Store
privacy.html           політика конфіденційності (потрібна для Store)
offline.html           резервна сторінка без мережі
```

Збірки немає: це статичні файли.

## Локальний запуск

```bash
python3 -m http.server 8080
# відкрити http://localhost:8080
```

## Публікація (HTTPS)

Робоча адреса: **https://mecanografia.info/ms-app/**. Основний сайт — Cloudflare Pages (проєкт `mecanografiapage`), файли застосунку лежать у підпапці `ms-app/` репозиторію сайту. Усі шляхи відносні, тож `scope` і `start_url` у маніфесті автоматично стають `/ms-app/`.

Оновлення: скопіюйте файли цього репозиторію (крім `README.md`, `.github/`, `screenshots/store/`) у `ms-app/` сайту і задеплойте сайт.

Як запасний варіант, у репозиторії є `.github/workflows/pages.yml` для GitHub Pages (запускається з `main`).

Після кожного релізу збільшуйте `VERSION` у `sw.js`, щоб користувачі отримали оновлення.

## Пакування MSIX через PWABuilder

1. Відкрийте [pwabuilder.com](https://www.pwabuilder.com/), вставте HTTPS-адресу застосунку і натисніть **Start**.
2. Перевірте, що Manifest, Service Worker і Security зелені.
3. **Package for stores → Windows → Generate Package**, заповніть дані з Partner Center
   (*Partner Center → продукт 9MTGZL7G21VP → Product management → Product identity*):
   - **Package ID** → `Package/Identity/Name`
   - **Publisher ID** → `Package/Identity/Publisher` (рядок `CN=...`)
   - **Publisher display name** → `Package/Properties/PublisherDisplayName`
   - **App name**: `Mecanografía Info` (має збігатися із зарезервованою назвою)
   - **Version**: `1.0.0` (кожне наступне подання — вища версія)
4. Завантажте ZIP, у ньому `.msixbundle` і `.classic.appxbundle`.

## Подання в Partner Center

1. Продукт 9MTGZL7G21VP → **Start submission**.
2. **Packages**: завантажте `.msixbundle` (і `.classic.appxbundle` для старих версій Windows 10).
3. **Properties**: категорія *Education*, URL політики конфіденційності — `<адреса застосунку>/privacy.html`.
4. **Age ratings**: анкета IARC (без збору даних, без реклами, без взаємодії між користувачами).
5. **Store listings (es-ES, en-US)**: опис, скриншоти з папки `screenshots/` (для Store бажано знімки 1366×768 або більші), іконка з `icons/icon-512.png`.
6. **Submit to the Store**.

## Конфіденційність

Застосунок не збирає персональних даних: результати, мова й тема зберігаються лише в `localStorage` пристрою. Див. `privacy.html`.
