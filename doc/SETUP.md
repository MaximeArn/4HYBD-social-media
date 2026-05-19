# BeUnreal — Documentation technique

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [Android Studio](https://developer.android.com/studio) avec un Virtual Device configuré
- [Eclipse Temurin 21](https://adoptium.net/) (JDK requis par Gradle)

---

## Installation

```bash
npm install
```

---

## Lancement

### Navigateur (développement)

```bash
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

### Android (émulateur)

Démarrer l'émulateur depuis Android Studio, puis :

```bash
npm run build && npx cap sync android && npx cap run android
```

> Première utilisation : si le dossier `android/` est absent, exécuter `npx cap add android` au préalable.

### Workflow de développement Android

À chaque modification du code source :

```bash
npm run build && npx cap run android
```

---

## Structure du projet

```
src/
├── pages/           # Pages principales (Home, Profile, Login, Register, Chat…)
├── components/      # Composants réutilisables (AppHeader, ChatInputBar, MessageBubble…)
├── services/
│   └── fakeApi/     # API simulée en mémoire
│       ├── seed/    # Données initiales par entité (users, stories, conversations, groups)
│       ├── auth.ts
│       ├── users.ts
│       ├── friends.ts
│       ├── conversations.ts
│       ├── groups.ts
│       ├── stories.ts
│       └── utils.ts
└── theme/           # Variables CSS et thème Ionic
```

### API simulée

L'application n'utilise pas de backend réel. Le module `fakeApi` simule une base de données en mémoire initialisée au démarrage avec des données de démonstration. Toutes les opérations (authentification, messages, stories, amis) passent par ce module. Les données ne sont pas persistées entre les sessions.

---

## Technologies

| Technologie | Rôle |
|---|---|
| [Ionic React](https://ionicframework.com/docs/react) | Composants UI mobiles |
| [Capacitor](https://capacitorjs.com/) | Bridge natif Android/iOS |
| [Vite](https://vitejs.dev/) | Build tool |
| [TypeScript](https://www.typescriptlang.org/) | Typage statique |
| [@capacitor/camera](https://capacitorjs.com/docs/apis/camera) | Accès à l'appareil photo natif |

---

## Permissions Android

Les permissions suivantes sont déclarées dans `android/app/src/main/AndroidManifest.xml` :

- `INTERNET` — chargement des avatars et images distantes
- `CAMERA` — prise de photo depuis l'application
- `READ_MEDIA_IMAGES` — accès à la galerie (Android 13+)
- `READ_EXTERNAL_STORAGE` — accès à la galerie (Android 12 et inférieurs)
