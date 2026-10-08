# GroupGeneratorFront

Front Next.js (App Router, Tailwind 4, TypeScript) d'un générateur de groupes équilibrés selon les compétences des membres.

Avant d'écrire du code Next.js, lire le guide concerné dans `node_modules/next/dist/docs/` (voir `AGENTS.md`).

## Workflow Git

- Une branche par sujet : `feat/…`, `fix/…`, `docs/…`, `chore/…`, `refactor/…`.
- Jamais de commit direct sur `main` : tout passe par une pull request.
- Commits en Conventional Commits : `type(scope): description` à l'impératif, en minuscules, sans point final.
- Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`.
- Un commit = un changement cohérent.
- Ne jamais ajouter de `Co-Authored-By` ni de mention d'outil dans les commits ou les PR.
- Titre de PR au format Conventional Commits, description courte : quoi, pourquoi, comment tester.

## Code

- TypeScript strict, pas de `any`.
- Pas de commentaires inutiles : le code se lit seul, on ne commente que le « pourquoi » non évident.
- Types partagés dans `lib/types.ts`.
- Composants serveur par défaut, `"use client"` seulement si nécessaire.
- Lancer `npm run lint` et `npm run build` avant chaque PR.

## API et mock

Le back n'est pas branché : `app/api/*` expose un mock en mémoire (`lib/mock-db.ts`) qui respecte le contrat.

- `GET /users` → `200 User[]`
- `POST /users` : `{ name, skills: [{ skillId, value: 0..5 }] }` (objet seul ou tableau) → `201`, `400` si body incomplet ou incorrect
- `GET /groups` → `200 Group[]`
- `POST /groups` : `{ nb_group, nb_user? }` → `201 Group[]`, `400` si body incomplet

```ts
interface User { id: number; name: string; group: number }
interface Group { id: number; members: User[] }
interface Skill { id: number; name: string; value: 1 | 2 | 3 | 4 | 5 }
```

## Direction artistique : « Atelier »

Esprit : un carnet d'atelier chaleureux et net. Papier clair, encre sombre, une couleur vive pour l'action, des cartes de groupes lisibles d'un coup d'œil. Sobre, jamais froid.

### Couleurs (tokens dans `app/globals.css`)

| Token | Clair | Sombre | Usage |
| --- | --- | --- | --- |
| `background` | `#faf7f2` | `#16151a` | fond de page |
| `surface` | `#ffffff` | `#201f26` | cartes, champs |
| `foreground` | `#1b1b1f` | `#f1eee8` | texte |
| `muted` | `#6b6b76` | `#9c9aa6` | texte secondaire |
| `border` | `#e7e2d9` | `#33313b` | filets, contours |
| `accent` | `#5b4bff` | `#8a7dff` | actions principales, focus |
| `accent-warm` | `#ff7a59` | `#ff8f73` | mise en avant, badges |

- Toujours passer par les tokens, jamais de couleur en dur dans les composants.
- Un seul accent principal par écran. Les groupes se distinguent par une pastille colorée tirée d'une palette fixe de 6 teintes douces.
- Contraste AA minimum, mode sombre via `prefers-color-scheme`.

### Typographie

- Geist Sans pour l'interface, Geist Mono pour les chiffres (niveaux, compteurs, identifiants).
- Titres en semi-bold, interlettrage resserré ; corps 16 px ; texte secondaire 14 px.

### Forme et mouvement

- Rayon 12 px sur cartes et champs, 999 px sur boutons et badges.
- Bordure 1 px `border` plutôt que grosses ombres ; ombre unique et douce au survol.
- Espacement sur grille de 4 px, sections aérées, largeur de contenu max 72 rem.
- Transitions 150 ms ease-out sur couleur, ombre et transformation ; pas d'animation décorative.
- Focus visible : anneau 2 px `accent`.

### Composants clés

- Niveau de compétence : 5 points (pleins/vides) avec la valeur en mono.
- Carte de groupe : pastille de couleur, titre « Groupe N », liste des membres avec avatar à initiales.
- Boutons : principal plein `accent`, secondaire contour `border`.
- Tonalité des textes : français, tutoiement, phrases courtes.
