# Roadmap : Développement de "The Hunt"

Ce document trace les étapes clés du développement de l'application, de la fondation jusqu'au déploiement.

---

## Phase 1 : Fondation & Infrastructure (Semaine 1)
*   [x] **Configuration Initiale :** Mise en place de TypeScript (recommandé), installation des dépendances majeures (React Navigation, Lucide Icons).
*   [x] **Design System :** Création du fichier de thème (couleurs, polices, espacements) basé sur la direction "Expédition".
*   [ ] **Navigation :** Structure des flux (Auth -> App -> Game).
*   [ ] **Écrans de base :** Accueil, Création de partie, Lobby.

## Phase 2 : Géolocalisation & Carte (Semaine 2)
*   [ ] **Intégration Map :** Mise en place de `react-native-maps` avec un style "Custom" (parchemin/sépia).
*   [ ] **Système GPS :** Tracking de la position en temps réel (foreground et background).
*   [ ] **Geofencing (Cercle/Polygone) :** Algorithme de détection de sortie de zone et compte à rebours d'alerte.

## Phase 3 : Mécaniques de Jeu Core (Semaine 3)
*   [ ] **Attribution des Rôles :** Logique de répartition Chasseurs/Proies.
*   [ ] **Points d'Objectifs :** Génération de points sur la carte via l'API Overpass (OpenStreetMap) pour les zones piétonnes.
*   [ ] **Piratage de Zone :** Logique de proximité et timer de 60s pour valider une zone.

## Phase 4 : Interaction & Capture (Semaine 4)
*   [ ] **Système de Scan :** Intégration de la caméra et génération du QR Code dynamique pour la capture.
*   [ ] **Compétences (Skills) :** Développement des 6 compétences (Leurre, Scan, Brouilleur, etc.) et gestion des cooldowns.
*   [ ] **HUD Dynamique :** Jauge de danger pour les proies et overlay radar pour les chasseurs.

## Phase 5 : Polissage & Finalisation (Semaine 5)
*   [ ] **Animations & Audio :** Ajout des transitions "Glitch/Jungle", sons d'ambiance et retours haptiques.
*   [ ] **Fin de Partie :** Écran de statistiques, calcul des scores et historique de la partie.
*   [ ] **Tests Terrain :** Alpha test avec 5-10 joueurs réels pour calibrer la précision GPS et l'équilibre des rôles.

---

## Objectif Minimum Viable (MVP)
1.  Créer une partie avec une zone circulaire.
2.  Assigner les rôles.
3.  Voir les joueurs sur la carte.
4.  Capturer une proie via scan QR.
5.  Terminer la partie au temps ou à l'élimination.
