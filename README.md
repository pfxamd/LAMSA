# LAMSA

**LAMSA — Donnez vie à vos espaces.**

Concept PFXAMD d'un site de peinture, décoration et finitions à Tétouan. Site en français, direction visuelle « Living Surfaces », sans dépendances externes ou service payant.

**Direction visuelle approuvée (règle du projet) :** [Living Surfaces — DESIGN_DIRECTION.md](DESIGN_DIRECTION.md). L'ancien langage éditorial « La Césure », ses titres de magazine et sa numérotation ne doivent pas être restaurés lors des travaux ultérieurs. Le logo et les fonctionnalités existantes sont préservés.

## Pages

| Page | Dossier | Rôle |
| --- | --- | --- |
| Accueil | [`index.html`](index.html) | Présentation de l'entreprise, changements de palette, prestations et aperçu du LAB |
| Services | [`services/`](services/) | 5 catégories, illustrations CSS et choix de finitions |
| Réalisations | [`realisations/`](realisations/) | 3 études de couleurs **conceptuelles** et comparateurs avant/après |
| À propos | [`a-propos/`](a-propos/) | Approche et méthode de travail |
| LAMSA LAB | [`lab/`](lab/) | Expérience interactive complète héritée de la phase 02 |
| Devis | [`devis/`](devis/) | Créateur local de récapitulatif — **envoi non encore connecté** |

Les éléments communs sont dans [`assets/site.css`](assets/site.css) et [`assets/site.js`](assets/site.js). La version fonctionnelle de LAMSA LAB reste dans [`lab/lab.js`](lab/lab.js) et [`lab/lab.css`](lab/lab.css). Les images de la marque sont dans [`brand/`](brand/).

## Démarrage local

```bash
python3 -m http.server 8000
```

Ouvrir `http://localhost:8000/`. Les chemins relatifs fonctionnent également sous le préfixe d'un sous-site GitHub Pages. Pas de build, npm, WebGL, upload, backend ou police hébergée.

## Avancement

Consulter [`ROADMAP.md`](ROADMAP.md) et les [GitHub Issues](https://github.com/pfxamd/LAMSA/issues) pour les phases et critères. La phase 02 est clôturée. La phase 03 a livré la structure des six pages et leurs interactions d'interface ; la recette visuelle inter-navigateurs reste prévue en phase 05.

**Important :** « Réalisations » présente des études de démonstration, pas de chantiers clients. La page « Devis » prépare et copie un brouillon sur l'appareil du visiteur, elle n'envoie aucune information à un professionnel. L'intégration du contact et du parcours commercial est le périmètre de la phase 04. Les ambiances LAB sont indicatives et non photométriques.

## Documents

- [Charte et logo](brand/BRAND.md)
- [Planche de marque](brand/preview.html)
- [LAMSA LAB, phase 02](lab/README.md)
- [Tests réalisés pour la phase 02](tests/PHASE2.md)
- [Livraison et vérifications structurelles de la phase 03](tests/PHASE3.md)

## Direction visuelle actuelle

Voir [DESIGN_DIRECTION.md](DESIGN_DIRECTION.md). Le site adopte une interface chaleureuse et tangible inspirée des surfaces peintes et des intérieurs habités. Le précédent style éditorial, les numéros de sections et les éléments imitant les magazines sont abandonnés. Le laboratoire et les comparateurs restent fonctionnels.
