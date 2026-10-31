# LAMSA LAB — phase 02 finalisée

Studio interactif de couleurs et finitions, réalisé en SVG, CSS et JavaScript natif. Pas de WebGL, dépendances NPM, upload, appels réseau, ni traitement des photos des visiteurs.

## Fonctions livrées

- Trois scènes illustrées en SVG : salon, chambre et boutique.
- Deux surfaces sélectionnables par pièce, au toucher, à la souris et au clavier.
- 12 nuances prédéfinies + sélecteur de couleur libre.
- 4 harmonies originales appliquées simultanément aux deux murs.
- Finitions mat, velours, minérale (interprétation graphique, non photométrique).
- Éclairages jour et soir avec lumière directionnelle ; textures et ombrages révisés pour mieux distinguer les finitions.
- Comparaison avant/après au curseur natif et avec une poignée de césure glissable dans la scène.
- Export PNG 1440 × 975, lien partageable reproduisant les choix.
- Index dynamique des couleurs des deux murs sur écran large.
- Export PNG nettoyé des marqueurs de sélection et de comparaison, avec bandeau LAMSA et références des deux teintes.
- Comparateur attrapable dès 0 % et jusqu’à 100 %, au pointeur et via son curseur clavier.
- Réinitialisation qui nettoie les paramètres de partage de l’URL.
- Interface française, responsive, sans données personnelles.

## Exécution

Servir la racine du dépôt avec un serveur HTTP statique, par exemple :

```sh
python3 -m http.server 8000
```

Ouvrir `http://localhost:8000`. Compatible avec la publication statique GitHub Pages / Cloudflare Pages. Aucun build nécessaire.

## Limitations connues

- Les scènes sont des illustrations architecturales **2D** conçues pour la démonstration ; elles ne constituent ni des photographies ni un nuancier physique calibré.
- Les textures et variations d’éclairage sont des simulations indicatives, non des rendus photoréalistes.
- Les prix, la réservation et le flux d’envoi de devis ne font pas partie de ce prototype.
- Le fonctionnement du presse-papiers varie selon le contexte sécurisé et les permissions du navigateur ; un lien copiable est proposé en repli.

## Validation de la phase 02 (2026-10-31)

Le test réutilisable [`tests/phase2_smoke.py`](../tests/phase2_smoke.py) a été exécuté avec Chromium headless. Il injecte la page et ses ressources localement, sans réseau :

- **5 dimensions** : 320, 390, 768, 1024 et 1440 px (simulation tactile pour les trois premières).
- **90 combinaisons** validées : 3 pièces × 3 finitions × 2 ambiances, sur chacune des 5 dimensions.
- Contrôles : changement individuel des deux murs, harmonies à deux teintes, clavier, clic et toucher simulé.
- Comparateur : entrée initiale à 0 %, glissement direct, clavier Home/End, fin à 100 %.
- Partage : vérification de la génération du lien et restauration de la configuration sérialisée.
- Export : vrai PNG 1440 × 975, couleurs vérifiées en pixels, aucun marqueur de sélection ni poignée dans le SVG exporté.
- Réinitialisation, rendu sans débordement horizontal et absence d’erreur JavaScript pendant ces tests.
- Inspection visuelle des 3 décors et des 3 finitions, notamment aux largeurs de 390 et 1440 px.

**Périmètre de la validation :** Chromium automatisé, avec simulations de largeur et de toucher. Firefox, Safari et les appareils physiques n’ont pas été testés ; ils relèvent de la vérification globale (phase 05). L’apparence des teintes reste indicative et ne remplace pas un échantillon de peinture réel.

Pour reproduire le test dans un environnement de développement disposant de Playwright Python et de Chromium :

```sh
python tests/phase2_smoke.py
```

Le site lui-même reste sans dépendance Playwright ni service externe.
