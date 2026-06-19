# Treballar amb IA en aquest projecte

Guia pràctica per iterar amb Cursor, Copilot, Claude, etc. sense repetir context cada vegada.

---

## Abans de demanar un canvi

1. Assegura't que l'assistent pot veure **`AGENTS.md`** (a Cursor ja és regla de workspace).
2. Indica el **tipus de tasca** (dades, UI, cerca, i18n, desplegament).
3. Limita l'abast: «només la home», «només el modal LocateItemSheet», etc.

---

## Plantilles de prompt

### Afegir o moure objectes

```
Afegeix [objecte] a [espai] / [secció] a data/inventory.json.
Segueix docs/DATA.md. Executa pnpm validate:data quan acabis.
No tradueixis el nom de l'objecte.
```

### Canvi d'UI / estils

```
[Descripció del canvi visual]
Mantén minimalisme i modes clar/fosc (dark: variants).
Reutilitza classes de app/globals.css abans d'inventar noves.
Fitxers probables: [components/… o app/page.tsx]
No posis el plànol dins d'una card extra.
```

### Nou text a la UI

```
Afegeix la clau [nom] a ca.ts, es.ts i en.ts (typeof ca).
Text en català: «…»
```

### Bug o comportament

```
Quan [acció], passa [problema]. Hauria de [comportament esperat].
Ruta: /space/armari-1?highlight=…
Revisa SpaceFloorPlan / SpaceClient segons calgui.
```

### Refactor o performance

```
[Objectiu]
Restricció: seguir static export (AGENTS.md). Sense API routes.
Preferir canvis petits; no reescriure mòduls sencers.
```

---

## Mapa ràpid: «on ho toco?»

| Vols canviar… | Fitxers |
| ------------- | ------- |
| Inventari | `data/inventory.json` |
| Cerca fuzzy | `lib/fuse-search.ts` |
| Resultats home | `app/page.tsx`, `components/ItemCard.tsx` |
| Plànol armari/calaix | `components/SpaceFloorPlan.tsx` |
| Modal «on està» | `components/LocateItemSheet.tsx` |
| Cerca dins espai | `app/space/[id]/SpaceClient.tsx` |
| Cerca global | `app/search/SearchResults.tsx` |
| QR | `app/qr/page.tsx`, `components/QRCode.tsx` |
| Idioma | `lib/translations/*.ts`, `lib/i18n.tsx` |
| Tema clar/fosc | `lib/theme.tsx`, `app/globals.css` |
| Configuració (header) | `components/SettingsMenu.tsx` |
| Estils compartits | `app/globals.css` |
| PWA / offline | `public/sw.js`, `components/ServiceWorkerRegistration.tsx` |

---

## Comprovacions després d'un canvi d'IA

```bash
pnpm exec tsc --noEmit
pnpm build
pnpm validate:data    # si has tocat inventory.json
```

Prova manual mínim:

- [ ] Home: cerca → resultat → modal plànol
- [ ] Espai: tocar secció → llista; `?highlight=` destaca un sol prestatge
- [ ] Canvi idioma i tema (Configuració)
- [ ] Mode fosc i clar

---

## Errors freqüents de la IA (i com evitar-los)

| Error | Correcció |
| ----- | --------- |
| Proposa `npm install` | Digues «pnpm only» o referencia `AGENTS.md` |
| Afegeix API route | Recorda `output: 'export'` |
| `useSearchParams` sense Suspense | Segueix `app/search/page.tsx` |
| Tradueix noms d'objectes | Inventari sempre en català |
| Card grossa al voltant del plànol | Plànol = files interactives; veure `docs/UI.md` |
| Duplica estat selecció + highlight | Un sol actiu al plànol; `onSectionSelect` neteja URL |
| Crea `ThemeToggle` / `LocaleSwitcher` | Ja dins `SettingsMenu` |

---

## Context útil per enganxar en xats llargs

```
Projecte: Stashly (whereis-app)
Stack: Next.js 14 static export, pnpm, Tailwind, Fuse.js
Dades: data/inventory.json (català)
Docs: AGENTS.md + docs/
```

---

## Quan actualitzar la documentació

Demana a la IA (o fes-ho tu):

> «Actualitza AGENTS.md i el doc de docs/ que correspongui amb el canvi que acabem de fer.»

Això manté el següent xat alineat amb la realitat del codi.
