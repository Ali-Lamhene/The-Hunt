# Architecture des Écrans : App "The Hunt"

Ce document détaille l'interface utilisateur (UI) et l'expérience utilisateur (UX) pour l'application de jeu de piste réel **The Hunt**. Chaque écran est conçu pour maximiser l'immersion et la clarté sous pression.

---

## 1. Phase d'Accueil et Préparation

### Écran A : Accueil & Connexion
Le point d'entrée pour tous les joueurs.
*   **Fonctionnalités :** Saisie du pseudonyme, création de partie ou rejoindre via un code (ex: PIN à 6 chiffres).
*   **Design :** Ambiance sombre, néon, logo "The Hunt" central.

### Écran B : Configuration de la Zone (Hôte uniquement)
Où les limites de la chasse sont définies.
*   **Carte Interactive :** Sélection entre mode Cercle (curseur de rayon) ou Polygone (points à placer).
*   **Paramètres de Jeu :** Durée de la partie, ratio Chasseurs/Proies, nombre de points d'objectifs.
*   **Validation :** Bouton "Lancer la session".

### Écran C : Lobby d'Attente
Liste des joueurs connectés en temps réel.
*   **Affichage :** Grille des pseudos avec statut "Prêt".
*   **Chat intégré :** Petit module pour coordonner le point de rendez-vous physique.

---

## 2. Lancement et Attribution

### Écran D : Révélation du Rôle
Animation dramatique lors du lancement de la partie.
*   **Visuel :** Effet "Glitch" ou compte à rebours.
*   **Contenu :** Affiche en gros "CHASSEUR" (Rouge) ou "PROIE" (Bleu) avec un bref rappel de la compétence spéciale assignée.

---

## 3. L'Écran de Jeu Principal (La Carte)
C'est l'écran où les joueurs passeront 90% de leur temps.

### Écran E : Interface de Jeu
| Élément | Description |
| :--- | :--- |
| **La Carte** | Affiche le périmètre, les zones d'objectifs et les pings GPS. |
| **HUD Tactique** | Chronomètre global en haut au centre. Jauge de danger (proximité) pour les proies. |
| **Boutons de Skill** | Icônes flottantes en bas à droite avec anneau de cooldown (temps de recharge). |
| **Overlay Radar** | Effet visuel de balayage lors de l'utilisation d'un scan. |

---

## 4. Écrans d'Interaction Contextuels

### Écran F : Piratage d'Objectif
S'affiche quand une proie entre dans un cercle d'objectif.
*   **Visualisation :** Cercle de chargement (0-100%) au centre de l'écran.
*   **Alerte :** Pulsation rouge si la proie sort de la zone avant la fin des 60s.

### Écran G : Capture & Scanner
*   **Côté Proie :** Bouton "Je suis pris" qui affiche un QR Code dynamique plein écran.
*   **Côté Chasseur :** Bouton "Capturer" qui ouvre l'appareil photo pour scanner le code.
*   **Confirmation :** Animation d'élimination ("Target Neutralized").

### Écran H : Hors-Zone (Alerte)
Recouvre l'écran en rouge translucide avec un compte à rebours de 30 secondes et un avertissement sonore.

---

## 5. Fin de Partie et Statistiques

### Écran I : Résumé & Podium
*   **Annonce du vainqueur :** "Victoire des Chasseurs" ou "Évasion Réussie".
*   **Statistiques :** Distance parcourue, nombre d'objectifs piratés, temps de survie, captures réalisées.
*   **Historique :** Replay accéléré de la carte montrant les déplacements des points durant la partie.
