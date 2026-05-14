# Font Attribution

Poster Lab self-hosts these open web fonts in `public/fonts/` for canvas-safe preview and PNG export.

| Font | File | Source | License |
| --- | --- | --- | --- |
| ZCOOL KuaiLe | `public/fonts/zcool-kuaile.ttf` | Google Fonts | SIL Open Font License 1.1 |
| ZCOOL QingKe HuangYou | `public/fonts/zcool-qingke-huangyou.ttf` | Google Fonts | SIL Open Font License 1.1 |
| Ma Shan Zheng | `public/fonts/ma-shan-zheng.ttf` | Google Fonts | SIL Open Font License 1.1 |
| Long Cang | `public/fonts/long-cang.ttf` | Google Fonts | SIL Open Font License 1.1 |

The fonts are embedded locally so poster preview and canvas export can wait for `document.fonts.ready` and render the selected typeface consistently. These files use the full Google Fonts TTF distributions to preserve broad Chinese glyph coverage for arbitrary poster text; subsetting to WOFF2 can be added later if the editor gains a fixed character set.
