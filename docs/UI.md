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

| Classe | Ús |
| ------ | ---- |
| `search-field` | Input de cerca (SearchBar) |
| `btn-toolbar` | Navegació neutra (enrere, esborrar cerca) |
| `btn-header-action` | Header: text zinc, **icones amber** |
| `btn-brand-ghost` | Accions secundàries taronja (poc usada al header) |
| `card-interactive` | Cards clicables (resultats, espais) |
| `card-base` | Files d'objectes al plànol |
| `card-highlighted` | Objecte/secció destacada (vora esquerra amber) |
| `page-toolbar` | Capçalera sticky de la pàgina d'espai |
| `section-label` | Títols de secció («Navega pels espais») |
| `badge-soft` | Comptador d'objectes |
| `meta-count` | Text secundari de resultats |

Preferir reutilitzar aquestes classes abans d'afegir Tailwind inline repetit.

---

## Pàgines

### Home (`app/page.tsx`)

- Header: logo + títol + ⓘ + Configuració + QR
- Cerca directa (sense dock/card extra)
- Resultats en grid; tap → `LocateItemSheet`
- «Navega pels espais» + grid d'espais (sense hint extra)

### Espai (`SpaceClient.tsx`)

- `page-toolbar`: enrere, nom, badge, SearchBar
- Plànol + llista de la secció seleccionada
- Cerca local substitueix plànol mentre hi ha query

### Modal localització (`LocateItemSheet.tsx`)

- `SpaceFloorPlan` amb `planOnly compact interactive={false}`
- Silueta: peus (armari) o marc (calaixera) com al plànol principal

---

## SpaceFloorPlan

| Prop | Efecte |
| ---- | ------ |
| `interactive={true}` | Seccions són `<button>`; hover zinc |
| `interactive={false}` | Preview estàtic (modal) |
| `compact` | Alçades reduïdes; marc de calaixera al modal |
| `planOnly` | Amaga llista d'objectes sota el plànol |
| `highlightItemName` | Selecciona secció + scroll; destaca item a la llista |
| `onSectionSelect` | Neteja `?highlight=` si l'usuari canvia secció |

**Un sol prestatge actiu** al plànol (`active={selectedSectionId === section.id}`).

---

## Icones

- `AppIcon` — logo header / favicon (`app/icon.svg`)
- `SpaceIcon` + `TYPE_COLOR` — tipus d'espai (cabinet, drawers, shelf)

---

## Modals

- `AboutSheet` — com funciona (3 passos)
- `LocateItemSheet` — on està l'objecte
- `SettingsMenu` — tema + idioma (portal, bottom sheet mobile)

Tots usen `useDialogA11y` on cal focus trap.

---

## i18n visible

Claus habituals:

- `home.searchPlaceholder`, `home.searchHeading`, `home.browseHeading`
- `space.goToSpaceList`, `about.*`
- `settings.*`

Font: `lib/translations/ca.ts`.

---

## Checklist UI per a la IA

- [ ] Mode clar i fosc provats
- [ ] Touch targets ≥ 44px on botons crítics
- [ ] Focus visible (`focus-visible:ring-amber-400`)
- [ ] No nested card al plànol
- [ ] Header: icones amber, text neutre (`btn-header-action`)
- [ ] Nous strings a ca + es + en
