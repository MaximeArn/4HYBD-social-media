# BeUnreal

Application mobile de partage de stories géolocalisées, développée avec Ionic React et Capacitor.

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [Android Studio](https://developer.android.com/studio) avec un Virtual Device configuré
- [Eclipse Temurin 21](https://adoptium.net/) (JDK requis par Gradle pour le build Android)

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

Démarrer l'émulateur depuis Android Studio, puis exécuter :

```bash
npm run build && npx cap sync android && npx cap run android
```

> Première utilisation : si le dossier `android/` est absent, ajouter la plateforme au préalable avec `npx cap add android`.

---

## Workflow de développement Android

À chaque modification du code source, rebuilder et redéployer :

```bash
npm run build && npx cap run android
```

---

## Structure du projet

```
src/
├── pages/          # Pages principales (Home, Profile, Login, Register, Chat…)
├── components/     # Composants réutilisables
├── services/
│   └── fakeApi/    # API simulée (données en mémoire, seed, utilitaires)
└── theme/          # Variables CSS / thème Ionic
```

---

## Technologies

- [Ionic React](https://ionicframework.com/docs/react) — Composants UI
- [Capacitor](https://capacitorjs.com/) — Bridge natif Android/iOS
- [Vite](https://vitejs.dev/) — Build tool
- [TypeScript](https://www.typescriptlang.org/)
