# LAMSA — Living Surfaces

**Statut : APPROUVÉE PAR LE PROPRIÉTAIRE — 2026-10-31.** Direction visuelle de référence pour **les six pages et toutes les évolutions futures**. La remplacer seulement sur demande explicite du propriétaire.

**Règle de priorité :** ce document fait autorité pour le design du site. Les anciens principes de « La Césure » encore présents dans `brand/BRAND.md`, `ROADMAP.md`, des commentaires CSS ou des prototypes sont historiques lorsqu'ils sont incompatibles avec cette direction. La marque et ses SVG existants restent conservés sauf décision explicite contraire.

## Intention

LAMSA est un concept de **société locale de peinture et décoration à Tétouan**, pas un magazine ni une publication de design. L’interface doit communiquer la qualité d’un mur bien préparé, le confort d’une maison habitée, le plaisir de choisir une couleur et la simplicité de demander un devis.

## Langage visuel

- Navigation douce et accessible, dans un panneau clair ; liens lisibles, état actif par aplat coloré, appel au devis clairement visible. **Aucune numérotation**.
- Typographie de service contemporaine, humaine et claire ; supprimer les titres condensés monumentaux et les codes de mise en page éditoriale.
- Couleurs de surfaces : plâtre blanc chaud, sauge, vert profond, sable, argile, touche framboise de marque. Des accents qui évoquent la peinture, jamais un arc-en-ciel décoratif.
- Scènes de vie et matériaux tangibles plutôt que blocs abstraits : canapé, comptoir, lit découpés en WebP transparent avec des murs modulables.
- Espacements confortables, volumes doux, surfaces à bords polis et micro-transitions discrètes. Pas de listes d’articles, pas de grands numéros de rubrique ni de filets de magazine.
- Mobile : menu facile au doigt, touches d’au moins 44 px, sélecteur de couleur accessible, pas de défilement horizontal.

## Interdits visuels — décision explicite

- **Aucun style éditorial ou de magazine** : ne jamais réintroduire des mises en page de revue, des compositions de couverture ou de sommaire, ni des grilles de publication.
- **Aucune numérotation décorative** : pas d'index de section, de gros `01 / 02 / 03`, de compteur de page ou de repères de magazine. Les quantités nécessaires à une fonction restent autorisées (par exemple mesures et valeurs de couleur).
- Pas de typographie d'affiche condensée monumentale en capitales comme système dominant, ni de filets de séparation purement éditoriaux.
- Ne pas revenir à des cartes rectangulaires génériques, à des listes d'articles ou à un site « portfolio de designer » comme modèle de présentation.
- Ne pas dériver la nouvelle interface des références de sites de peinture existants ; inventer des compositions pertinentes à **une entreprise de peinture, décoration et rénovation résidentielle**.

## Règles de continuité

- La navigation doit évoquer des surfaces et des finitions douces : logo lisible, liens de service clairs, accès devis évident et menu mobile facile à utiliser. Éviter absolument de recréer les numéros d'étapes de l'ancien en-tête.
- Les sections présentent ce qu'une entreprise fait réellement : espaces habitables, murs, enduits, finitions, ambiance, conseil, réalisation, devis. Garder un parcours commercial naturel.
- Préserver la palette, le logo vectoriel officiel et les interactions existantes tant qu'aucune demande ne les modifie. Les détails matériels/peinture sont préférés aux ornements abstraits.
- Pour chaque nouveau composant ou refonte, vérifier **ordinateur et mobile**, contrastes, lisibilité, clic/toucher et absence de retour aux interdits visuels.
- Ne jamais interpréter une demande d'amélioration du code, d'ajout de fonctionnalité ou d'optimisation comme une autorisation de changer cette direction.

## Fonctionnalités intouchables

- LAMSA LAB : trois pièces, deux murs par pièce, choix de couleurs et finitions, lumière, comparateur, export PNG, partage. Pas d’upload.
- Réalisations : les 3 études avant/après gardent leur glissière, et le mobilier reste stable au-dessus des deux états.
- Devis : composition et copie du récapitulatif ; ne jamais simuler un envoi ou inventer des coordonnées.
- Projet conçu et affiché en français, sans hébergement supplémentaire ni API payante.

## Vérification et livraison

Les fichiers statiques restent à leurs URL indépendantes ; le déploiement utilise le GitHub Pages existant. Conserver la séparation entre code enregistré, build réussi et vérification réelle du site publié.
