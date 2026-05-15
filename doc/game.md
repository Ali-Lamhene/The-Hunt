# The Hunt - Game Design Document

## 1. Concept Global
"The Hunt" est un jeu asymétrique de chasse à l'homme en extérieur utilisant la géolocalisation. Des **Chasseurs** doivent traquer et capturer des **Proies** dans un périmètre défini, tandis que les proies tentent de survivre et d'accomplir des objectifs pour s'échapper.

---

## 2. Rôles et Équilibre (Asymétrie)
*   **Les Proies :** En surnombre (ratio idéal : 1 chasseur pour 3 à 4 proies). Leur but est la survie et la complétion d'objectifs.
*   **Les Chasseurs :** En infériorité numérique mais dotés de capacités de traque. Leur but est d'éliminer toutes les proies avant la fin du temps imparti.

---

## 3. Mécanique de Capture
Pour garantir l'équité et éviter les erreurs GPS :
1.  **Contact Physique :** Le chasseur doit toucher la proie dans la vraie vie.
2.  **Validation Numérique :** La proie présente un **QR Code dynamique** (ou un code PIN de secours) que le chasseur scanne via l'application.
3.  **Résultat :** Une fois scannée, la proie est éliminée de la partie.

---

## 4. Objectifs et Victoire

### Conditions de victoire
*   **Proies :** Faire tomber le chronomètre global à zéro.
*   **Chasseurs :** Capturer toutes les proies avant la fin du temps.

### Mécanique de "Piratage de Zone"
*   Des points de contrôle sont générés aléatoirement dans la zone (via les données piétonnes d'**OpenStreetMap**).
*   Une proie doit rester dans un rayon de 10m du point pendant **60 secondes** pour le valider.
*   Chaque zone validée réduit le temps de jeu global de **15 minutes**.
*   *Cette mécanique force les proies à bouger et empêche les chasseurs de rester en groupe (camp).*

---

## 5. Le Terrain (Geofencing)
L'hôte définit la zone de jeu avant de commencer :
*   **Mode Express :** Un rayon ajustable (cercle) autour de sa position.
*   **Mode Expert :** Tracé d'un polygone libre sur la carte.

### Règle de la Frontière (Anti-triche)
*   **Sortie de zone :** Alerte immédiate + compte à rebours de **30 secondes**.
*   **Sanction :** Si le joueur ne rentre pas, sa position est diffusée en **temps réel** sur la carte pendant **15 minutes** (statut "Cible Prioritaire").

---

## 6. Compétences (Système de Cooldown)
Chaque rôle possède des capacités spéciales avec un temps de recharge (cooldown).

### Compétences Proies
*   **Leurre GPS :** Dépose un faux signal à la position actuelle.
*   **Brouilleur (Fantôme) :** Disparition totale des radars pendant 5 min.
*   **Écho-Radar :** Révèle le chasseur le plus proche pendant 10 sec.

### Compétences Chasseurs
*   **Scan Forcé :** Actualise immédiatement la position de toutes les proies.
*   **Piège Virtuel :** Alerte si une proie entre dans une zone spécifique.
*   **Trace Thermique :** Affiche le chemin parcouru par une proie sur les 5 dernières minutes.

---

## 7. Spécifications Techniques Clés
*   **Agnosticisme de la Map :** Génération automatique des points sur zones piétonnes.
*   **Gestion du Lobby :** Assignation automatique des rôles (ex: 20% chasseurs / 80% proies).
*   **Scalabilité :** Conçu pour fonctionner de 2 à 100+ joueurs.
