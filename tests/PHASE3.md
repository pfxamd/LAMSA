# LAMSA — Livraison du site, phase 03

**Portée :** architecture multi-pages française, système de navigation commun, identité La Césure, illustrations codées et intégration de LAMSA LAB.

## Livré

- `index.html` — accueil et illustration CSS d'un salon à 4 palettes modifiables.
- `services/index.html` — 5 prestations, illustrations graphiques individuelles et aperçu des finitions interactif.
- `realisations/index.html` — 3 études de couleur et comparaison avant/après avec glissière native.
- `a-propos/index.html` — positionnement, méthode et illustration identitaire.
- `lab/index.html` — expérience LAMSA LAB déplacée de l'ancien accueil vers une URL dédiée, sans remplacement de `lab/lab.js` ou `lab/lab.css`.
- `devis/index.html` — interface de préparation d'un récapitulatif, sans envoi.
- `assets/site.css` et `assets/site.js` — mise en page responsive, navigation mobile, interactions et résumé local.
- Tous les chemins relatifs sont prévus pour un site statique servi à la racine ou dans un sous-dossier.

## Contrôles à la livraison

- Validité structurelle : exactement un `<main>` et un `<h1>` dans chacune des 6 pages, navigation cohérente, éléments interactifs présents.
- Syntaxe du JavaScript commun contrôlée avec `node --check`.
- Liens internes et références de fichiers vérifiés par le script `tests/phase3_structure.py`.
- Le moteur LAB préservé, notamment `lab/lab.js` et `lab/lab.css` inchangés depuis la clôture de la phase 02.

## Points réservés aux phases suivantes

- **Phase 04** : destinataire, formulaire de devis transmis réellement (WhatsApp/email ou autre canal réel), parcours commercial, éventuelles coordonnées vérifiées.
- **Phase 05** : validation visuelle dans des navigateurs sur différents écrans, tests tactiles sur appareils physiques, accessibilité approfondie et performances réelles. Les essais de lancement du navigateur dans cet environnement n'ont pas permis de charger le site local, donc cette recette n'est **pas** déclarée réalisée.
- **Phase 06** : publication du produit uniquement sur demande explicite et contrôle réel de l'URL publique.

Les trois projets illustrés sont des études de design fictives, non des réalisations livrées à des clients. Aucune donnée de contact n'est envoyée ou sauvegardée par la page Devis.
