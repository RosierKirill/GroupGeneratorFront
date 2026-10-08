# Fonctionnement du système

Group Generator répartit des élèves en groupes équilibrés selon leurs compétences.

```
Navigateur ──► Front Next.js (3001) ──/api/*──► Back Bun + Hono (3000) ──► SQLite (back/data.sqlite)
```

| Dossier | Rôle |
| --- | --- |
| `groupgeneratorfront/` | Interface Next.js (App Router, MUI, Tailwind 4) |
| `back/` | API Hono sur Bun, base SQLite |
| `contract.yml` | Contrat OpenAPI entre le front et le back |

## Lancer le projet

```sh
cd back
bun install
bun run seed   # charge les fixtures
bun run dev    # http://localhost:3000

cd groupgeneratorfront
npm install
npm run dev    # http://localhost:3001 (Next prend le port libre suivant)
```

Le front appelle `/api/*`. `next.config.ts` réécrit ces appels vers `BACK_URL` (défaut `http://localhost:3000`). Pour un autre back, définir `BACK_URL` dans `groupgeneratorfront/.env.local`.

## Modèle de données

Trois tables SQLite :

- `User` : `id`, `name`, `group` (nul tant que l'élève n'est dans aucun groupe)
- `Skills` : `id`, `name`, `value` (entier de 1 à 5)
- `Userskills` : liaison `userId` / `skillId`

Il n'existe pas de table des groupes : un groupe est l'ensemble des élèves qui partagent la même valeur de `User.group`.

Le niveau (`value`) est porté par la compétence elle-même, pas par la liaison élève-compétence. Un niveau propre à chaque élève demanderait une colonne `value` sur `Userskills`.

## API

| Route | Description | Réponses |
| --- | --- | --- |
| `GET /skills` | Liste des compétences | `200` |
| `GET /users` | Liste des élèves avec leurs compétences | `200` |
| `POST /users` | Crée un élève : `{ name, skills: [{ skillId, value }] }` | `201`, `400` |
| `GET /groups` | Groupes actuels, déduits de `User.group` | `200` |
| `POST /groups` | Génère les groupes : `{ nb_group, nb_user? }` | `201`, `400` |

Une compétence d'élève est renvoyée sous la forme `{ userId, skillId, name, value }`.

`POST /users` renvoie `400` si le nom est vide, si `skills` n'est pas un tableau, si une valeur n'est pas un entier de 1 à 5, si une compétence est en double ou si un `skillId` n'existe pas. `POST /groups` renvoie `400` si `nb_group` n'est pas un entier positif ou si `nb_user` est présent sans l'être.

Le contrat de référence est `contract.yml`.

## Génération des groupes

`POST /groups` exécute `GroupModel.generate` :

1. Chaque élève reçoit un score : la somme des niveaux de ses compétences.
2. Les élèves sont triés par score décroissant.
3. On crée `nb_group` groupes vides.
4. Chaque élève, du plus fort au plus faible, va dans le groupe le moins rempli. Si `nb_user` est défini, les groupes déjà pleins sont ignorés.
5. Les élèves qui ne trouvent plus de place restent sans groupe.
6. Le résultat est enregistré dans `User.group`, dans une seule transaction qui remet d'abord tous les groupes à `NULL`.

Chaque génération remplace donc les groupes précédents.

## Front

`app/page.tsx` charge élèves, groupes et compétences en parallèle, puis rafraîchit tout après chaque ajout ou génération.

| Composant | Rôle |
| --- | --- |
| `AddUserForm` | Nom et notation de chaque compétence, envoyés à `POST /users` |
| `UserList` | Une card par élève : groupe et compétences |
| `GroupList` | Formulaire de génération et une card par groupe |
| `SkillLevel` | Nom de la compétence et étoiles colorées selon le niveau |

`lib/api.ts` regroupe les appels HTTP, `lib/types.ts` les types partagés, `lib/group-colors.ts` la couleur de chaque groupe.

## Workflow

Voir `groupgeneratorfront/CLAUDE.md` : Conventional Commits, une PR par sujet, jamais de commit direct sur `main`. La direction artistique y est décrite aussi.
