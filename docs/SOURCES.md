# Источники и даты сбора

Все данные собраны **8–9 сентября 2026**. Цены на Booking.com сняты на даты заезда
**9–11 октября 2026, 2 гостя, 1 номер, валюта PLN** — при других датах они будут другими.

## По объектам

| № | Объект | Контакты и описание | Цены |
|---|---|---|---|
| 1 | Winnica Maria Anna | winnicapodkarpacie.pl | Booking (номер 610 zł/2 ночи, домик 798, вилла 1774) |
| 2 | Pałac Mierzęcin | palacmierzecin.pl/kontakt | прайс на сайте, 360–620 zł |
| 3 | Poziom 511 + Białe Skały | poziom511.pl/kontakt, bialeskaly.pl | Google Hotels 671 zł; Booking ~775; Expedia 856–908 |
| 4 | Dwór Sanna | dworsanna.pl/kontakt | dworsanna.pl/hotel/cennik — полный прайс, лето/зима |
| 5 | Pałac Mała Wieś | palacmalawies.pl | Booking, от 824–989 zł/ночь |
| 6 | Winnica Turnau | winnicaturnau.pl (энотуризм) | прайс на сайте: 250/300/1500 zł |
| 7 | Winnica Płochockich | winnicaplochockich.pl | от 150 zł за двухместный |
| 8 | Winnica Jerzmanice | Slowhop (сайт не работает) | Slowhop: 700 zł + 200 zł за гостя |
| 9 | Winnica Witaj Słońce | winnicawitajslonce.pl | прайс не публикуется, только по запросу |
| 10 | Winnica Sztukówka | sztukowka.pl | Booking: от 918 zł за 2 ночи |
| 11 | Winnica Dwie Granice | winnicadwiegranice.pl | Nocowanie.pl, цены только после выбора дат |
| 12 | Winnica Chronów | winnicachronow.pl | прайс на сайте: 200/240/280 zł |

## Как обновлять цены

Booking отдаёт цены только живым браузером — обычный fetch возвращает пустую страницу,
а поиск по названию (`?ss=`) часто выбрасывает на главную. Работает так:

1. Прямой URL отеля с параметрами:
   `https://www.booking.com/hotel/pl/<slug>.pl.html?checkin=ГГГГ-ММ-ДД&checkout=ГГГГ-ММ-ДД&group_adults=2&no_rooms=1&selected_currency=PLN`
2. Прокрутить вниз до блока «Dostępność» / «Alternatywne terminy» — там видны цены за ночь.
3. Известные slug: `winnica-maria-anna-wyzne1`, `winnica-sztukowka`, `dwor-sanna`,
   `palac-mala-wies`, `paaac-mierzacin-wellnes-amp-wine-resort`.
   Для Poziom 511 slug подобрать не удалось — брали Google Hotels (`google.com/travel/search`).

## Исправление в исходных данных

Dwór Sanna в первоначальном списке был отнесён к Вонвольнице (Wąwolnica). На самом деле
усадьба находится в **Wierzchowiskach Drugich, гмина Modliborzyce**, ~58 км от Люблина.
Исправлено в карточке, там же оставлена пометка об этой путанице.
