# LAMSA LAB — prototype 01

Studio interactif de couleurs et finitions, réalisé en SVG, CSS et JavaScript natif. Pas de WebGL, dépendances NPM, upload, appels réseau, ni traitement des photos des visiteurs.

## Fonctions livrées

- Trois scènes illustrées en SVG : salon, chambre et boutique.
- Deux surfaces sélectionnables par pièce, au toucher, à la souris et au clavier.
- 12 nuances prédéfinies + sélecteur de couleur libre.
- Finitions mat, velours, minérale (interprétation graphique, non photométrique).
- Éclairages jour et soir ; comparaison avant/après au curseur.
- Export PNG 1440 × 975, lien partageable reproduisant les choix.
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
