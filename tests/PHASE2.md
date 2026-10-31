# LAMSA LAB — Recette de clôture de la phase 02

**État :** moteur de personnalisation fonctionnel et documenté. Tests de navigateur locaux passés sous Chromium. **Ce n'est ni un rendu photoréaliste ni une certification multi-navigateurs.**

## Inclus dans la version de la phase 02

- 3 pièces illustrées en SVG et 2 murs personnalisables par pièce.
- 12 couleurs + saisie d'une couleur personnalisée ; 4 harmonies bi-murs.
- 3 finitions illustratives : mat, velours, minérale.
- Éclairage jour/soir ; perspective, ombres et réactions à la lumière.
- Avant/après avec curseur accessible ET poignée de séparation dans l'illustration.
- Résultat PNG 1440 × 975 sans repère de sélection ni poignée ; légende des teintes et de la pièce.
- URL de partage avec restauration des réglages et remise à zéro sans état ancien.
- Interface en français et commandes tactiles / clavier / souris.

## Vérification effectuée le 2026-10-31

Suite de test automatisée : [`tests/phase2_smoke.py`](phase2_smoke.py). Exécutée avec le Chromium local et Playwright, sans ressource externe.

| Contrôle | Résultat |
|---|---|
| 3 pièces × 3 finitions × 2 éclairages × 5 largeurs | **90 cas passés** |
| Largeurs 320, 390, 768, 1024, 1440 px | Aucune erreur JavaScript ni débordement horizontal dans les tests |
| Sélection des murs et harmonies | Vérifiée |
| Couleurs indépendantes et libellés | Vérifiés |
| Navigation et activation clavier | Vérifiées |
| Tactile en émulation mobile | Vérifié |
| Avant/après, curseur natif, poignée draggable | Vérifiés |
| Partage et réhydratation des paramètres | Vérifiés |
| PNG téléchargé, taille, nuancier, éléments exclus | Vérifiés |
| Réinitialisation complète | Vérifiée |

Commandes de test (dépendances de test uniquement : Python, Playwright, Pillow et Chromium) :

```sh
python tests/phase2_smoke.py
```

## Inspection visuelle

- Comparaison manuelle des scènes salon/chambre/boutique et des finitions sur les captures Chromium locales.
- Contrôle des compositions aux largeurs mobiles et desktop ; aucun débordement visuel critique observé.
- La texture minérale et le reflet velours sont intentionnellement stylisés : ne pas les présenter comme une peinture matérielle exacte.

## Limites et tests transférés à la phase 05

- Aucune exécution native sous Firefox ou Safari/WebKit et **aucun essai sur appareil physique** n'ont été validés dans cette phase. La phase 05 doit couvrir ces environnements.
- L'ergonomie observée sur l'émulation mobile ne garantit pas un comportement identique sur tous les appareils.
- Les couleurs dépendent de l'écran et ne représentent ni un nuancier homologué ni une simulation lumineuse physiquement fidèle.
- Le site commercial et l'envoi de devis restent à créer en phases 03 et 04.

## Décision

**Phase 02 clôturée pour son périmètre : prototype LAMSA LAB local, code source et régression Chromium.** Les critères de livraison finale publique restent soumis aux phases 03 à 06.
