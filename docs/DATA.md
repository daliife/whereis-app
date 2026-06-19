# Dades d'inventari

Tot el contingut de casa viu a **`data/inventory.json`**. No hi ha base de dades ni API.

---

## Esquema

```jsonc
{
  "spaces": [
    {
      "id": "armari-1",              // URL: /space/armari-1/
      "name": "Armari sòtan esquerra", // Visible a la UI (català)
      "type": "cabinet",             // "cabinet" | "drawers" | "shelf"
      "sections": [
        {
          "id": "prestatge-1",       // Únic dins l'espai
          "name": "Prestatge 4t pis (dalt)",
          "items": [
            {
              "name": "Barbacoa",
              "tags": ["barbacoa", "graella", "cuina"]  // opcional però recomanat
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Tipus d'espai (`type`)

| Valor | Plànol | Notes |
| ----- | ------ | ----- |
| `cabinet` | Prestatges apilats + peus | Seccions «sobre l'armari» es detecten per id/nom amb «sobre» |
| `drawers` | Calaixos amb nansa | Totes les seccions són calaixos |
| `shelf` | Prestatges (estanteria) | Mateix component que cabinet amb variants |

El plànol (`SpaceFloorPlan`) adapta formes i silueta segons `type`.

---

## Convencions de noms (seccions)

Ordre **de baix a dalt** (com pisos):

- `Prestatge 1r pis (baix)` — el més baix
- `Prestatge 2n pis`, `3r pis`, `4t pis (dalt)` — cap amunt
- `Terra` — sol al fons de l'armari
- `Damunt l'armari` — secció superior separada (si existeix)

Consistència ajuda la cerca i el plànol visual.

---

## Tags

- Milloren la cerca fuzzy (`item.name` + `item.tags`)
- En català, minúscules, sense duplicar el nom sencer
- Exemple: objecte «Diferents sprays» → tags `["spray", " pintura"]`

Si `tags` falta o està buit, `pnpm validate:data` mostra un **warning** (no error).

---

## Validació

```bash
pnpm validate:data
```

Comprova:

- IDs d'espai i secció únics
- `type` permès
- Noms no buits
- Avisos per tags buits o noms d'objecte duplicats dins un espai

---

## Afegir un espai nou

1. Copia una entrada similar a `spaces[]` i adapta `id`, `name`, `type`, `sections`
2. `id` en kebab-case, estable ( és la URL i el QR )
3. `pnpm validate:data && pnpm build`
4. Genera QR des de `/qr` després del desplegament

**No cal tocar codi** per routing ni llista de la home.

---

## Afegir / moure objectes

1. Edita `sections[].items[]` de l'espai corresponent
2. Afegeix `tags` relacionats
3. `pnpm validate:data`

---

## Idioma del contingut

| Què | Idioma |
| --- | ------ |
| Noms d'objectes, seccions, tags | **Català** (fix) |
| Botons, placeholders, errors | ca / es / en (`lib/translations/`) |

No demanis a la IA que tradueixi `inventory.json` quan canviïs idioma de la UI.

---

## Exemple de prompt per a la IA

```
Afegeix l'objecte «Clau allen 6mm» a «Prestatge 2n pis» de l'espai armari-1,
amb tags ["clau", "allen", "eines"]. Segueix docs/DATA.md i valida amb pnpm validate:data.
```
