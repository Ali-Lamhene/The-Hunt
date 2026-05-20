# Plan d'Implémentation : Rejoindre via QR Code & Affichage Lobby — The Hunt

Ce document décrit le plan d'implémentation complet pour ajouter le scan de QR Code et la génération de QR Code associés à un salon (lobby), afin de permettre aux agents de rejoindre rapidement une expédition.

---

## 1. Alignement Architectural & Choix Techniques

Conformément à la spécification technique et au document `doc/architecture.md` (mis à jour) :
1. **Composants Fonctionnels & Typage** : Tous les nouveaux composants seront écrits sous forme de fonctions typées TypeScript (`const Component: React.FC<Props> = ...`).
2. **Respect du Thème Graphique (Jungle Expedition)** : L'interface délaissera tout aspect technologique numérique moderne pour s'ancrer dans une atmosphère d'exploration sauvage (textures de vieux cuir tanné, parchemins jaunis `#F4EDE0`, fond de canopée vert très sombre `#0D0802`, bordures et ornements en laiton/bronze `#7A5C3A`, typographie manuscrite `SpecialElite` pour les notes d'exploration et monospace pour les chronomètres).
3. **Séparation des Préoccupations** : La logique de scan, de gestion de permissions de la caméra et de validation du salon sera isolée dans des hooks ou encapsulée proprement pour éviter de surcharger les vues.

### Dépendances Requises
Pour implémenter cette fonctionnalité sous Expo SDK 54, deux packages majeurs sont nécessaires :
*   **`react-native-qrcode-svg`** : Solution performante et stable s'appuyant sur `react-native-svg` (déjà installé dans le projet) pour générer des QR Codes vectoriels de haute qualité sans dépendance native complexe.
*   **`expo-camera`** : Le module officiel d'Expo pour utiliser la caméra et décoder les QR Codes en temps réel via son composant moderne et performant `CameraView`.

---

## 2. Arborescence Cible des Fichiers

Voici les nouveaux composants et les modifications de fichiers prévues dans l'arborescence :

```text
src/ (ou racine du projet)
  ├── components/
  │   ├── lobby/
  │   │   └── LobbyQrCode.tsx        # NOUVEAU : Affiche le code PIN + le QR Code associé dans le lobby
  │   └── ui/
  │       └── QrCodeScannerModal.tsx # NOUVEAU : Modale d'observation tactique pour scanner les QR Codes
  ├── components/ui/
  │   └── TacticalBottomBar.tsx      # MODIFIÉ : Ajout du bouton de déclenchement du scan QR
  └── app/
      └── (app)/
          └── lobby/
              └── [id].tsx           # MODIFIÉ : Intégration du composant LobbyQrCode pour les joueurs
```

---

## 3. Plan d'Implémentation en 4 Phases

### Phase 1 : Infrastructure & Dépendances
*   **Action 1.1** : Installation des paquets requis via npm.
    ```bash
    npm install react-native-qrcode-svg expo-camera
    ```
*   **Action 1.2** : Configuration des permissions caméra dans `app.json` (iOS & Android) pour assurer la conformité lors de la compilation.
    *   Ajout de la clé `"permission"` ou `"plugins"` pour `expo-camera` avec une description immersive en français et anglais (ex: *"L'accès à la caméra est requis pour lire le code d'activation de l'expédition."*).

### Phase 2 : Logique & Validation QR Code
*   **Action 2.1** : Création de la logique de scan et de validation.
    *   Mise en place d'un système de validation du format du QR Code (ex: vérification que le contenu scanné correspond à un code de salon valide de type alphanumérique court).
*   **Action 2.2** : Intégration de la fonction `joinLobby` de Firebase dans le flux de scan de QR Code pour rediriger automatiquement l'utilisateur vers `app/(app)/lobby/[id]` après validation du salon.

### Phase 3 : UI, Styles & Esthétique "Jungle Expedition"
*   **Action 3.1** : Conception du composant `LobbyQrCode.tsx`.
    *   Affichage du code de salon géant en police monospace imitant des cadrans de boussole mécanique.
    *   QR Code enveloppé dans un encadrement en laiton patiné (contours en laque bronze, ornements d'expédition) sur un fond simulant un carnet d'exploration en papier parchemin jauni (`#F4EDE0`).
    *   Bouton discret "Partager les coordonnées" ou "Copier le code" avec retour haptique d'engrenage mécanique (double impulsion douce).
*   **Action 3.2** : Conception de `QrCodeScannerModal.tsx`.
    *   Modale plein écran simulant une lunette d'observation en cuivre ou un objectif de boussole en laiton.
    *   Masque d'ombrage organique (imitation de feuillage ou contour en cuir usé) autour de la zone de visée carrée centrale pour immerger l'explorateur.
    *   Indicateur d'acquisition de cible à l'encre rouge sang (`#C0392B`) ou bronze au lieu d'un laser technologique vert ou d'une grille néon.
    *   Gestion élégante des états (demande de permission caméra, refus de permission avec bouton de redirection vers les paramètres, chargement).

### Phase 4 : Intégration & Recette globale
*   **Action 4.1** : Intégration du scanneur dans `TacticalBottomBar.tsx`.
    *   Dans l'écran "Rejoindre une partie" (`activeSubView === 'join'`), ajout d'un bouton d'action secondaire sous forme de talisman en laiton (icône de boussole ou lentille de caméra) pour ouvrir `QrCodeScannerModal`.
    *   Au scan réussi, déclenchement d'un double clic haptique (succès mécanique), fermeture de la modale et exécution de `handleValidateJoin` avec le code récupéré.
*   **Action 4.2** : Intégration du QR Code dans `app/(app)/lobby/[id].tsx`.
    *   Ajout du composant `LobbyQrCode` au-dessus de la liste des joueurs ou à côté du résumé de l'expédition.
    *   Optimisation pour que le QR Code soit facilement visible par les autres joueurs physiques à proximité.
*   **Action 4.3** : Phase de tests et validation.
    *   Vérification des demandes de permissions et des comportements sur plateforme physique (si disponible) ou via simulateur / fallback web.
    *   Vérification du parcours utilisateur complet : *Host crée la partie -> Le carnet d'expédition affiche le QR Code -> Guest l'observe avec sa lunette -> Guest rejoint instantanément*.

---

## 4. Rendu Visuel Cible (Mockup Conceptuel)

Le QR code dans le lobby respectera le style "Carnet d'exploration" :
```text
  +---------------------------------------+
  |        CARNET D'EXPÉDITION            |
  |        SALON : AX89D                  |
  |         [======= LAITON =======]      |
  |         |   # # # # # # # # # #   |      |
  |         |   #   # #   # #   # #   |      |
  |         |   # # # #     # # # #   |      |
  |         |   # # # # # # # # # #   |      |
  |         +=====================+      |
  |    Alignez la boussole pour rejoindre|
  +---------------------------------------+
```

---

## 5. Prochaines étapes suggérées

1. Installer les dépendances `expo-camera` et `react-native-qrcode-svg`.
2. Créer le composant de scan QR Code en forme de lunette d'exploration `QrCodeScannerModal`.
3. Créer le composant d'affichage QR Code `LobbyQrCode` (style carnet d'expédition).
4. Raccorder les deux interfaces aux services Firebase existants et à l'état global.
