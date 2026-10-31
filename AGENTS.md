# Instructions de contribution — LAMSA

## Priorité de design

Avant toute modification d'interface, lire [DESIGN_DIRECTION.md](DESIGN_DIRECTION.md). C'est **la direction visuelle approuvée par le propriétaire le 2026-10-31**, et elle s'applique à toutes les pages, aux éléments partagés et aux futures fonctionnalités.

- LAMSA est une **entreprise de peinture, décoration et rénovation de maisons/commerces à Tétouan**, pas un magazine, une publication, un portfolio éditorial ni un catalogue d'articles.
- **Ne jamais réintroduire** la mise en page éditoriale, les numéros de chapitres ou d'études comme décor, les indices de pages, les titres d'affiche monumentaux condensés ou les séparateurs de magazine.
- Rechercher des formes spécifiques aux **surfaces peintes, aux textures, à l'éclairage, aux murs et aux intérieurs vécus**. Interfaces chaleureuses, lisibles, contemporaines et commerciales ; navigation simple et devise de la marque.
- Préserver les SVG du logo et les fonctionnalités existantes : **LAB, comparateurs, personnalisation des couleurs, devis**.
- Si d'anciens commentaires, prototypes ou documents de marque recommandent « La Césure » comme **direction d'interface web**, les considérer comme historiques. La priorité revient à `DESIGN_DIRECTION.md`. Le dessin du logo peut en conserver les origines.
- Toute nouvelle direction visuelle nécessite une **instruction explicite** du propriétaire ; les demandes de corrections, de maintenance ou d'optimisation conservent la direction validée.

## Travail technique

Site français statique, sans nouveaux services payants. Modifier les fichiers concernés sans casser les URLs ou les interactions. Tester les éléments modifiés sur desktop et mobile et vérifier les liens/contrôles concernés. Ne pas annoncer de publication vérifiée uniquement parce qu'un commit a été poussé. Ne pas déclencher manuellement de workflow GitHub Actions.
