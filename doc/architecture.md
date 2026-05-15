# Architecture & Clean Code : "The Hunt"

Ce document définit les standards techniques et l'organisation du code pour garantir la maintenabilité et la scalabilité du projet.

---

## 1. Structure du Projet
Nous utiliserons une structure modulaire par couche :

```text
src/
  assets/          # Images, sons, polices
  components/      # Composants UI atomiques et réutilisables
  constants/       # Couleurs, dimensions, configurations (Theme)
  hooks/           # Hooks personnalisés (useLocation, useGameLogic)
  navigation/      # Configuration des navigateurs
  screens/         # Écrans complets
  services/        # API, Bluetooth, Stockage local
  store/           # Gestion d'état global (Zustand ou Context)
  utils/           # Fonctions utilitaires (maths, formats, etc.)
```

---

## 2. Règles de Clean Code

### Composants & Hooks
*   **Séparation des préoccupations :** Un écran (`screen`) ne doit pas contenir de logique métier complexe. Utilisez des **Hooks** pour extraire la logique.
*   **Composants Fonctionnels :** Utilisation exclusive de `const MyComponent = () => { ... }`.
*   **Props :** Toujours typer les props (via TypeScript ou PropTypes).

### Nommage
*   **Composants :** `PascalCase` (ex: `CaptureButton.js`)
*   **Fonctions & Variables :** `camelCase` (ex: `handleCapture()`)
*   **Constantes :** `UPPER_SNAKE_CASE` (ex: `MAX_CAPTURE_DISTANCE`)
*   **Fichiers de styles :** Garder les styles dans le même fichier que le composant ou dans un fichier `.styles.js` adjacent.

### État Global
*   Préférer **Zustand** pour sa légèreté et sa performance avec React Native.
*   Diviser le store en petits slices : `useAuthStore`, `useGameStore`, `useLocationStore`.

---

## 3. Performance & Optimisation
*   **Mémoïsation :** Utiliser `useMemo` et `useCallback` pour les calculs lourds liés au GPS ou aux rendus de la carte.
*   **Images :** Optimiser les assets avant de les intégrer (format WebP recommandé).
*   **Nettoyage :** Toujours stopper les timers (`setInterval`) et les listeners GPS dans le `return` de `useEffect`.

---

## 4. Documentation du Code
*   Utiliser des commentaires JSDoc pour les fonctions complexes.
*   Le code doit être "auto-explicatif" : un nom de variable clair vaut mieux qu'un commentaire.

---

## 5. Gestion des Erreurs
*   Utiliser des `ErrorBoundary` au niveau des écrans critiques.
*   Logger les erreurs GPS ou réseau via un service dédié (ex: Sentry) en production.
