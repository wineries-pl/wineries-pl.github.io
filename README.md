# winnice-pl

Интерактивная карта польских виноделен, где можно **поужинать и остаться на ночь**.
12 объектов: контакты, цены на ночлег, формат ужина, ссылки на бронирование.

**Опубликованный артефакт:** https://claude.ai/code/artifact/a0fd8b95-7c3e-4bda-872e-c75ffe9a15cc
**Сайт на GitHub Pages:** https://wineries-pl.github.io/

## Что внутри

```
artifact/winnice-polska.html   готовая страница (self-contained: HTML + CSS + JS в одном файле)
data/places.json               данные по 12 объектам, извлечённые из страницы
data/sources.json              источники по каждому объекту: URL, id, статус, уровень доверия
data/providers.json            каналы сбора: шаблоны URL, якоря разметки, известные подвохи
docs/STATE.md                  где остановились, что проверено, что дальше
docs/SOURCES.md                человекочитаемая сводка источников и дат
docs/SCRAPING.md               как собирать цены и с чего начинать автоматизацию
```

## Как это устроено

Одностраничное приложение без зависимостей. Карта — **inline SVG, нарисованный из координат**
(контур Польши, Балтика, реки, автострады, озёра, города), потому что артефакты Claude
работают под строгим CSP: внешние запросы блокируются, тайлы OpenStreetMap загрузить нельзя.

Ключевые блоки в `artifact/winnice-polska.html`:

| Блок | Что делает |
|---|---|
| `var PLACES` | все данные объектов (см. `data/places.json`) |
| `var BORDER / SEA / RIVERS / ROADS / LAKES / CITIES / HILLS` | география карты в парах `[широта, долгота]` |
| `px() / py() / toPath() / smoothPath()` | проекция координат в SVG (equirectangular, cos 52°) |
| `applyVB()` | пересчёт масштаба: маркеры и подписи держат постоянный размер на экране |
| `fitAspect() / relayout()` | подгонка карты под контейнер, ResizeObserver |
| `renderList() / renderDetail()` | правая панель — список и карточка объекта |
| фильтры `filters.dine` / `filters.stay` | два независимых набора чипов, между группами — И |

## Как обновить

**Изменить данные объекта** — правьте `var PLACES` прямо в HTML, затем пересоберите
`data/places.json`:

```bash
node -e '
const fs=require("fs"), src=fs.readFileSync("artifact/winnice-polska.html","utf8");
const js=src.match(/<script>([\s\S]*)<\/script>/)[1];
const chunk=js.slice(js.indexOf("var PLACES"), js.indexOf("var DINE"));
fs.writeFileSync("data/places.json", JSON.stringify(new Function(chunk+"; return PLACES;")(),null,2)+"\n");
'
```

**Проверить синтаксис** перед публикацией:

```bash
node -e 'new Function(require("fs").readFileSync("artifact/winnice-polska.html","utf8").match(/<script>([\s\S]*)<\/script>/)[1])'
```

**Опубликовать заново** — из Claude Code: инструмент Artifact с тем же URL
(`url: https://claude.ai/code/artifact/a0fd8b95-7c3e-4bda-872e-c75ffe9a15cc`),
иначе создастся новая страница с новым адресом.

**GitHub Pages** — репозиторий `wineries-pl/wineries-pl.github.io`. Каждый пуш в `main` запускает
`.github/workflows/pages.yml`: он склеивает `site/head.html` + `artifact/winnice-polska.html` +
`site/foot.html` в `index.html` и выкладывает его. Артефакт — фрагмент без `<head>` (claude.ai
оборачивает его сам), поэтому `<head>` с charset, viewport и SEO-метатегами живёт в `site/head.html`.
Править страницу — только в `artifact/winnice-polska.html`.

Пуш идёт от пользователя `wineries-pl`: ключ `~/.ssh/github_winnice` подключается через
`[includeIf "gitdir:~/a0s_github/winnice-pl/"]` → `~/.gitconfig-wineries-pl` (`core.sshCommand`
и `user.*`), на обеих машинах.

## Поля объекта

| Поле | Значение |
|---|---|
| `n` | порядковый номер, он же цифра в маркере |
| `lat` / `lon` | координаты (по адресу, точность — до населённого пункта) |
| `dine` | `full` ресторан на месте · `part` ужин по заказу · `self` своя кухня/гриль |
| `stay` | `hotel` отель · `rooms` комнаты у винодела · `house` домик/апартамент |
| `price` / `pnote` | короткая цена для списка и развёрнутое пояснение с источником |
| `lp` | смещение подписи маркера, если соседние накладываются |
| `tel` / `mail` / `web` / `book` | контакты и каналы бронирования |
