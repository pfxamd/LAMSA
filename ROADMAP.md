# LAMSA — Feuille de route et état du projet

> **Référence de pilotage du projet.** Mise à jour : 2026-10-31.  
> **Objectif final :** livrer un site d'entreprise de peinture/décoration en français, original et pleinement navigable, avec un laboratoire interactif de couleurs et finitions, publié et vérifié sur le Web, puis présenté comme Concept dans le portfolio PFXAMD.

## Décisions validées

| Sujet | Décision |
| --- | --- |
| Marque | **LAMSA** |
| Signature | **Donnez vie à vos espaces.** |
| Métier | Peinture, décoration, finitions et rénovation |
| Marché | Tétouan, Maroc, et environs |
| Positionnement | Entreprise locale générale, accessible et professionnelle |
| Langue de tout le site | **Français uniquement** |
| Création | Identité, scénographie et interactions originales par **PFXAMD** |
| Direction graphique actuelle | **La Césure** — marque vectorielle, césure décalée, palette Pétrole / Framboise / Enduit / Glacis |
| Expérience majeure | **LAMSA LAB** sur pièces prédéfinies conçues par nos soins |
| Entrées interdites | **Aucun upload de photo** : ni image de pièce, ni image personnelle |
| Contraintes techniques | Site léger et statique ; aucune dépendance à un service payant, pas de 3D ni WebGL |
| Hébergement autorisé | **GitHub Pages ou Cloudflare** uniquement |
| Déploiement | Publication uniquement sur instruction explicite, puis vérification du lien réellement accessible |

## État des six phases

| Phase | État | Référence | Critère de sortie |
| --- | --- | --- | --- |
| **01 — Brand Identity** | **Base livrée** | [Charte](brand/BRAND.md), [aperçu](brand/preview.html), [SVG](brand/lamsa-wordmark.svg) | Direction d'identité documentée avec logo vectoriel, palette et signature |
| **02 — LAMSA LAB** | **Terminé : moteur et prototype contrôlés en Chromium** | [Issue #1](https://github.com/pfxamd/LAMSA/issues/1) | Scènes, couleurs, finitions, éclairages, export et mobile revus/validés |
| **03 — Website Design & Development** | **Livré en code : 6 pages françaises intégrées** | [Issue #2](https://github.com/pfxamd/LAMSA/issues/2) | Site français multi-pages, identité forte, parcours de navigation réel |
| **04 — Commercial Features** | À faire | [Issue #3](https://github.com/pfxamd/LAMSA/issues/3) | Services, réalisations, devis et parcours commercial fonctionnels |
| **05 — Quality Assurance** | À faire | [Issue #4](https://github.com/pfxamd/LAMSA/issues/4) | Vérifications visuelles et techniques documentées, pas de défaut critique |
| **06 — Launch & Case Study** | À faire | [Issue #5](https://github.com/pfxamd/LAMSA/issues/5) | Lien public réellement vérifié + présentation du Concept sur PFXAMD |

**Progression suivie par jalons : 3 phases livrées sur 6 ; la phase 04 est la prochaine.** Ce ratio n'est pas un pourcentage de code achevé.

## Livrables déjà présents dans GitHub

- [`brand/BRAND.md`](brand/BRAND.md) — concept de marque, positionnement, couleurs et principes du logo.
- [`brand/preview.html`](brand/preview.html) — planche de marque responsive.
- [`brand/lamsa-wordmark.svg`](brand/lamsa-wordmark.svg) et [`brand/lamsa-symbol.svg`](brand/lamsa-symbol.svg) — graphismes vectoriels originaux, plus variantes.
- [`brand/tokens.css`](brand/tokens.css) — palette et variables.
- [`index.html`](index.html) — page d’accueil, avec illustration de surface à 4 ambiances interactives.
- [`lab/lab.js`](lab/lab.js) et [`lab/lab.css`](lab/lab.css) — moteur interactif sans serveur ni upload.
- [`lab/README.md`](lab/README.md) — documentation des capacités et limites.

### LAMSA LAB — présent dans le prototype

- 3 décors SVG : salon, chambre, boutique.
- 2 murs indépendants par scène.
- 12 couleurs prédéfinies et sélection libre.
- 3 finitions indicatives (mat, velours, minérale), avec ombres et éclairages révisés.
- 2 ambiances (jour, soir), comparaison avant/après au curseur ou par glissement direct de la césure.
- 4 accords de couleurs coordonnés pour les deux murs.
- Export propre de la configuration en PNG **1440 × 975** et partage par lien, avec restauration des paramètres.
- Utilisation souris / tactile / clavier, responsive ; sans données personnelles ni chargement de photo.

**Vérification de la phase 02 :** [rapport de recette locale](tests/PHASE2.md). 90 combinaisons testées en Chromium sur 5 largeurs (tactile émulé et clavier compris). Pas de validation Firefox/Safari ou d'appareil physique à ce stade : tests réservés à la phase 05.

**Limite explicite :** les pièces sont des dessins 2D et les effets sont indicatifs, non photoréalistes ni une correspondance colorimétrique certifiée.

## Livraison de la phase 03

- Pages réelles : [`Accueil`](index.html), [`Services`](services/), [`Réalisations`](realisations/), [`À propos`](a-propos/), [`LAMSA LAB`](lab/) et [`Devis`](devis/).
- Identité La Césure, navigation et pied de page communs, illustrations géométriques codées et interactions locales.
- LAB phase 02 préservé sans modifier son moteur ; accessible par une route dédiée.
- Devis : récapitulatif copiable **sans envoi** (intégration commerciale en phase 04).
- [Contrôles de structure de la phase 03](tests/PHASE3.md) — 6 pages, liens internes, éléments sémantiques et syntaxe du JavaScript. Vérification visuelle multi-navigateurs **non accomplie**, prévue en phase 05.

## Historique vérifiable

- [`815346f9`](https://github.com/pfxamd/LAMSA/commit/815346f9fd9aad36af65c2370d894c4434609bf7) — première direction de marque, charte et SVG.
- [`01201751`](https://github.com/pfxamd/LAMSA/commit/01201751c6a1b68e2ffd812cd24290ee3ac917f1) — prototype LAB, interface française et documentation.
- [`27732564`](https://github.com/pfxamd/LAMSA/commit/2773256445329d765277ae711f92f447f0cd7692) — finitions, lumières, harmonies et césure tactile.
- [`0fc8b488`](https://github.com/pfxamd/LAMSA/commit/0fc8b4883996de617ffc3c0bad8bc3e553d4852f) — correctifs de comparaison et d'export, tests de régression reproductibles.
- Les tâches de finition et développement sont suivies dans les [Issues](https://github.com/pfxamd/LAMSA/issues).

## Prochaine action unique

**Phase 04 — Connecter le parcours commercial : [Issue #3](https://github.com/pfxamd/LAMSA/issues/3).** Remplacer le brouillon de devis local par une demande réellement transmissible au canal choisi et vérifier les données commerciales. Les essais visuels inter-navigateurs et appareils physiques restent en phase 05.

## Règles de suivi

1. Maintenir cette page quand une phase change d'état ; ne pas marquer « terminé » sans livrable et vérification.
2. Cocher les critères dans l'Issue correspondante au fur et à mesure des validations.
3. Préserver la fonctionnalité LAB et la charte sauf décision de redesign.
4. Ne pas confondre code dans GitHub, test local et publication accessible au public.
5. Ne pas créer de nouvelles pages de démonstration sans utilité ; l'objectif est **un seul produit final commercial convaincant**.
