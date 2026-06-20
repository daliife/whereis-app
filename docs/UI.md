# UI i disseny

Guia del sistema visual actual — minimal, mobile-first, amber com a accent.

---

## Principis

1. **Cerca primer** — flux principal a la home; navegació d'espais secundària
2. **Sense caixes redundants** — el plànol són files clicables, no una card static
3. **Un accent taronja** — icones de header i estats actius; text majoritàriament zinc
4. **Sempre `dark:`** — qualsevol canvi de color ha de funcionar en mode fosc

---

## Classes CSS compartides (`app/globals.css`)

### Layout

| Classe | Ús |
| ------ | ---- |
| `page-shell` | Contenidor de pàgina (padding, max-width) |
| `page-shell--wide` | Variant més ample (pàgina d'espai) |
| `page-shell--flush-x` | Sense padding horitzontal mobile (toolbar sticky) |
| `page-toolbar` | Capçalera sticky de la pàgina d'espai |
| `page-header` / `page-header-title` | Capçalera secundària (search, QR) |

### Botons

| Classe | Ús |
| ------ | ---- |
| `btn-primary` | CTA amber (modals, imprimir) |
| `btn-secondary` | Acció secundària amb vora brand |
| `btn-toolbar` / `btn-toolbar-icon` | Navegació neutra |
| `btn-sheet-close` | Tancar modals |
| `btn-text-link` / `btn-text-link-underline` | Enllaços de text |
| `btn-header-action` | Header: text zinc, icones amber |

### Cards i resultats

| Classe | Ús |
| ------ | ---- |
| `card-interactive` | Hover/focus de tota la card |
| `card-focus-wrap` | Wrapper clicable (resultats, espais) |
| `card-action-chevron` | Chevron secundari al hover |
| `item-tag` / `item-tags` | Chips de tags als resultats |
| `list-item-optimized` | `content-visibility: auto` per llistes llargues |

### Modals (bottom sheets)

| Classe | Ús |
| ------ | ---- |
| `sheet-overlay` | Backdrop + contenidor fix |
| `sheet-backdrop` | Fons fosc amb blur |
| `sheet-panel` | Panell (tall / medium variants) |
| `sheet-handle` / `sheet-handle-bar` | Drag handle mobile |
| `sheet-footer` | Peu amb CTA |

Preferir reutilitzar aquestes classes abans d'afegir Tailwind inline repetit.

---

## Components clau

| Component | Rol |
| --------- | --- |
| `SearchField` | SearchBar + cerques recents + drecera `/` |
| `SearchResultsList` | Grid de resultats amb windowing >100 items |
| `UiIcon` | SVG compartits (`search`, `close`, `back`, `qr`, …) |
| `LazyQRCode` | QR renderitzat només quan entra al viewport |
| `HomePageClient` | Shell client de la home (cerca + browse + footer) |

---

## Pàgines

### Home (`app/page.tsx` → Server)

- Server: passa `spaces` des de `getAllSpaces()`
- Client: `HomeSearchSection`, `HomeBrowseSection`, `HomeFooterNav`
- Cerca amb tags visibles, cerques recents i `/` per focus

### Espai (`SpaceClient.tsx`)

- `page-toolbar`: enrere, nom, badge, `SearchField`
- Plànol + llista de la secció seleccionada
- Cerca local substitueix plànol mentre hi ha query

### QR (`app/qr/page.tsx`)

- QR de la graella: `LazyQRCode` (off-screen lazy)
- Modal ampliat: `QRCode` immediat

---

## Icones

- `AppIcon` — logo header / favicon (`app/icon.svg`)
- `SpaceIcon` + `TYPE_COLOR` — tipus d'espai (cabinet, drawers, shelf)
- `UiIcon` — icones UI reutilitzables (`components/icons/UiIcon.tsx`)

---

## i18n

- Català carregat al bundle inicial
- Castellà i anglès: **lazy load** via `lib/load-locale.ts`
- Nous strings: `ca.ts` + `es.ts` + `en.ts`

Claus habituals: `home.*`, `search.recentSearches`, `about.*`, `settings.*`

---

## Checklist UI per a la IA

- [ ] Mode clar i fosc provats
- [ ] Touch targets ≥ 44px on botons crítics
- [ ] Focus visible (`focus-visible:ring-amber-400`)
- [ ] No nested card al plànol
- [ ] Header: icones amber, text neutre (`btn-header-action`)
- [ ] Nous strings a ca + es + en
- [ ] Icones via `UiIcon` quan sigui possible
- [ ] Cerca via `SearchField` (no `SearchBar` directe a pàgines)
