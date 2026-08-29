# 🚀 Space Match

Jeu de puzzle façon _Puyo Puyo_ sur le thème de l'espace : un astronaute prépare son
décollage en alignant des bulles d'oxygène colorées. Application web **et** mobile Android,
construite avec Vue 3 et embarquée via Capacitor.

> Nom de travail actuel : **Space Match** (`appId` : `com.majorgame.puyo`).

---

## Stack technique

| Domaine            | Techno                                             |
| ------------------ | ------------------------------------------------- |
| Framework          | Vue 3 (`<script setup>` SFC) + TypeScript          |
| Build              | Vite 7                                             |
| State management   | Pinia                                              |
| UI                 | PrimeVue 4 (thème Aura, dark mode) + Font Awesome  |
| i18n               | vue-i18n (français / anglais)                      |
| Routing            | vue-router 4                                       |
| Mobile             | Capacitor 7 (Android)                              |
| Stockage local     | `@capacitor/preferences` (web + natif)            |
| Tests              | Jest + ts-jest                                     |
| Qualité            | ESLint (flat config) + Prettier + Husky           |

Node requis : **>= 20** (développé sous Node 24).

---

## Démarrage rapide

```bash
# 1. Installer les dépendances (déclenche aussi husky via "prepare")
npm install

# 2. Créer le fichier d'environnement
cp .env.sample .env
# puis renseigner VITE_FRONTEND_URL_LAN (voir section Android)

# 3. Lancer le serveur de dev web
npm run dev:web
```

L'app est servie sur `http://localhost:5421`.

---

## Scripts npm

| Script                     | Description                                                             |
| -------------------------- | --------------------------------------------------------------------- |
| `npm run dev:web`          | Serveur de dev Vite (mode `development`), accessible sur le réseau local |
| `npm run dev:android:vite` | Serveur Vite en mode `android` sur `0.0.0.0:5421` (hot reload natif)   |
| `npm run dev:android:cap`  | `cap sync` + lancement de l'app sur l'émulateur avec live-reload       |
| `npm run build`            | Type-check (`vue-tsc`) + build Vite en mode `android`                  |
| `npm run build:android:prod` | Build de prod + `cap sync` avec `CAPACITOR_ENV=production` (embarque `dist/`) |
| `npm run test`             | Lance la suite Jest en mode verbose                                    |
| `npm run test:watch`       | Jest en mode watch                                                     |

---

## Développement Android

Le hot reload Capacitor charge l'app depuis le serveur Vite de la machine de dev.

1. Récupérer l'IP LAN de la machine (`ipconfig` sous Windows).
2. Renseigner `.env` :
   ```
   VITE_FRONTEND_URL_LAN=http://192.168.x.x:5421
   ```
3. Dans un terminal : `npm run dev:android:vite`
4. Dans un second terminal : `npm run dev:android:cap`

En build de production (`build:android:prod`), le serveur de dev est désactivé et
l'app embarque le contenu de `dist/` (voir `capacitor.config.ts`).

---

## Architecture du code

```
src/
├── Api/                    # Couche données (mock local via Preferences)
│   ├── config/             # storage.service.ts : seed + accès stockage
│   ├── models/             # Types des entités API
│   ├── repositories/       # Accès CRUD par entité
│   ├── services/           # Services "serveur" (logique côté données)
│   └── utils/
├── Game/                   # Domaine métier du jeu
│   ├── components/          # Composants UI (game, game2, menus, store, footer…)
│   ├── models/             # Enums & types du jeu
│   ├── pages/              # Splash · Loading · Home · Game · Store · Settings
│   ├── services/           # Façades : game-facade, score-facade, game-api
│   ├── store/              # Store Pinia (game.store.ts)
│   └── utils/              # bubble.utils.ts (logique des groupes de bulles)
├── Router/                 # Définition des routes
├── shared/                 # Stores, modèles, services et utils transverses
└── main.ts                 # Bootstrap : storage → Vue → PrimeVue → i18n → router
```

### Écrans

`SplashPage` → `LoadingPage` → `HomePage` → `GamePage` / `StorePage` / `SettingsPage`.

### Internationalisation

Les traductions vivent dans `languages/fr.json` et `languages/en.json`.
Locale par défaut : `fr` (fallback `fr`).

---

## Tests

```bash
npm run test
```

Configuration dans `jest.config.ts`. Les fichiers `*.spec.ts` sont exclus du lint.
Convention de nommage des tests en français (pattern AAA).

---

## Qualité & hooks Git

Husky exécute une série de vérifications **avant chaque commit** :

1. Validation des fichiers de config protégés (`.prettierrc.json`, `husky-scripts/`)
2. Validation du nom de branche
3. ESLint sur `src` (`.js`, `.ts`, `.vue`) — **bloquant si erreurs**
4. Prettier `--write` sur l'ensemble du repo

### Nommage des branches

Pattern imposé :

```
<category>/<reference>/<description-kebab-case>
```

- `category` : `feature` · `bugfix` · `hotfix` · `test`
- `reference` : `issue-<n>` ou `no-ref`
- Exemple : `feature/issue-42/create-new-button-component`

### Commits

Convention **Conventional Commits** en français, 72 caractères max, un commit = une seule chose.

---

## Configuration d'environnement

| Variable                 | Rôle                                                    |
| ------------------------ | ------------------------------------------------------ |
| `VITE_FRONTEND_URL_LAN`  | URL LAN du serveur de dev pour le hot reload Capacitor  |
| `CAPACITOR_ENV`          | `production` pour un build natif autonome (sans dev server) |
