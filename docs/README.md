# Documentació Stashly

Índex de la documentació del projecte. Pensada per **tu** (manteniment del inventari i UX) i per **assistentes d'IA** (canvis de codi coherents).

---

## Per on començar

| Si vols… | Llegeix |
| -------- | ------- |
| Entendre l'app en 5 minuts | [../README.md](../README.md) |
| Donar context a Cursor / Copilot | [../AGENTS.md](../AGENTS.md) |
| Demanar canvis amb IA sense soroll | [AI-WORKFLOW.md](AI-WORKFLOW.md) |
| Afegir o reorganitzar objectes | [DATA.md](DATA.md) |
| Entendre com encaixa el codi | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Tocar UI, colors o components | [UI.md](UI.md) |

---

## Ordre recomanat per a la IA

Quan obres un xat nou amb un assistent, adjunta o indica que llegeixi:

1. `AGENTS.md`
2. El doc del tema (`DATA.md`, `UI.md`, etc.)
3. Els fitxers concrets del canvi

Això redueix respostes que proposen API routes, npm, o patrons antics (p. ex. `lib/search.ts` com a únic mòdul de cerca).

---

## Manteniment

Després de canvis grans a l'arquitectura o la UI, actualitza:

- `AGENTS.md` — convencions i mapa de components
- El doc afectat dins `docs/`
- `README.md` — només si canvia l'inici ràpid o l'stack
