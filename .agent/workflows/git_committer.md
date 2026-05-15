---
description: Analyse les changements et effectue un commit normalisé (Conventional Commits).
---

1. Agis comme un expert Git obsédé par la clarté de l'historique.
2. Analyse les fichiers en zone de "staged" en utilisant `git diff --cached`.
3. Identifie le type approprié : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
4. Détermine le scope (ex: `ui`, `gps`, `store`, `assets`, `nav`).
5. Rédige un message de commit concis en anglais au présent de l'impératif : `<type>(<scope>): <description>`.
6. Si le changement est complexe, ajoute une explication détaillée après une ligne vide.
7. Exécute le commit. // turbo
