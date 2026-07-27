# Remédiation de l'audit AI-friendly — design

**Date :** 2026-07-27
**Projet :** leonie-moreau (Next.js 16.2.3, React 19, OpenNext + Cloudflare Workers)
**Domaine de production :** `https://leoniemoreau.com`

## Objectif

Corriger les constats de l'audit AI-friendly pour qu'un développeur — humain ou agent — puisse
reprendre le projet sans se faire piéger par du code généré commité, de la documentation périmée
ou des mécanismes implicites.

Le projet est déjà intégralement en TypeScript. Les 80 % de JavaScript affichés par GitHub
proviennent du dossier `.open-next/` commité (163 Ko sur 165 Ko de « JavaScript »), pas du code
source. Aucune conversion n'est nécessaire ; le tsconfig est en revanche renforcé.

## Décisions actées

| Sujet | Décision | Raison |
|---|---|---|
| Domaine | `leoniemoreau.com`, injecté par `NEXT_PUBLIC_SITE_URL` | Une URL fixe est indispensable au rendu statique ; la variable évite que preview et production partagent le même canonical |
| Tailwind | **Corriger**, pas retirer | Choix utilisateur : le projet doit rester extensible en Tailwind |
| `scripts/prepare-open-next.mjs` | Supprimer | Orphelin depuis le retrait de son appel dans `package.json`, et duplique `open-next.config.ts` — deux sources de vérité qui divergeront |
| TypeScript | Renforcer, pas convertir | Déjà 100 % TypeScript |
| Backend du formulaire | Hors périmètre | Sera traité par l'utilisateur plus tard |

## Périmètre

**Inclus :** rendu statique, SEO, performance des images, dette de dépôt, garde-fous CI,
renforcement TypeScript, correction Tailwind, structure de pied de page et de pages légales.

**Exclus :**

- **Backend du formulaire de réservation** — reporté. Seule la note destinée au développeur,
  aujourd'hui visible par les visiteurs, est retirée.
- **`next/image` et l'optimisation d'images** — nécessite d'arbitrer Cloudflare Images (coût et
  configuration). La vague 4 obtient l'essentiel du gain sans cette dépendance.
- **Tests automatisés** — le garde-fou CI (lint + types + build) est le minimum viable pour un
  projet de cette taille.
- **Rédaction des pages légales** — la structure est créée, le contenu appartient à l'utilisateur.

## Approche : quatre vagues par niveau de risque

Le découpage suit le rayon d'impact, pas le domaine fonctionnel. Chaque vague se vérifie et
s'annule indépendamment, et son critère de succès est objectif. Un découpage par domaine
mélangerait dans un même lot des ajouts triviaux et le changement de rendu, rendant tout retour
arrière coûteux.

---

### Vague 1 — Dépôt (risque runtime nul)

Aucun fichier exécuté n'est touché. Cette vague peut partir immédiatement.

**Sortir le code généré et les logs de git**

- `git rm -r --cached .open-next` — 12 fichiers, 163 Ko, déjà couverts par `.gitignore:23` mais
  ajoutés de force. Ils polluent chaque `grep`, produisent les 3 seules erreurs ESLint du projet,
  et faussent la barre de langages GitHub.
- `git rm --cached build-log.txt tailwindcss-33368.log` — `tailwindcss-33368.log` décrit un état
  qui n'existe plus : il référence `src/components/Portfolio.tsx`, fichier supprimé, et le chemin
  `C:\Users\clara\Desktop\Projets VS Code\Léonie Moreau` d'un autre poste. Un agent qui le lit en
  tire des conclusions fausses.
- Ajouter `build-log.txt` et `*.log` à `.gitignore`.

**Supprimer le code mort**

- `scripts/prepare-open-next.mjs` (voir décisions).
- Cinq SVG inutilisés : `public/next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`.
- Trois dépendances jamais importées dans `src/` : `clsx`, `tailwind-merge`, `lucide-react`.

**Documentation**

- Réécrire `README.md` : le boilerplate `create-next-app` actuel décrit un déploiement Vercel
  alors que le projet part sur Cloudflare Workers. Un agent qui le lit propose la mauvaise
  procédure.
- Enrichir `AGENTS.md` : domaine de production, chaîne de déploiement OpenNext/Cloudflare,
  contrainte d'installation Windows ARM, commandes de vérification.
- Ajouter `.open-next/**` à `globalIgnores` dans `eslint.config.mjs` — redondant après le
  `git rm`, mais protège si le dossier est régénéré localement.

**Vérification :** `eslint .` ne renvoie plus aucune erreur (les 3 venaient de `.open-next/`) ;
la répartition GitHub passe d'environ 84 % JavaScript à environ 56 % TypeScript / 38 % CSS.

---

### Vague 2 — Rendu statique et TypeScript

**Rétablir le rendu statique**

`src/app/layout.tsx` appelle `headers()` dans `generateMetadata`. Cette API dynamique dans le
layout racine bascule **toutes** les routes en rendu à la demande et neutralise le
`generateStaticParams` de `src/app/services/[slug]/page.tsx`.

Preuve mesurée : avec le layout actuel, le build affiche `ƒ` sur les quatre routes. En
remplaçant `headers()` par des métadonnées statiques, il affiche `○ /`, `○ /prints`,
`● /services/[slug]` avec les trois slugs prérendus. `build-log.txt` confirme que le site était
statique avant la refonte.

- Remplacer `generateMetadata()` par un `export const metadata: Metadata` statique.
- `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://leoniemoreau.com")`.
- Déclarer `NEXT_PUBLIC_SITE_URL` dans les variables Cloudflare et dans le workflow GitHub.

**Renforcer le tsconfig**

- `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`.
- `target` : `ES2017` → `ES2022`. Les navigateurs ciblés et `workerd` le supportent ; la sortie
  est plus légère et plus lisible.
- `noUncheckedIndexedAccess` fait remonter les accès `galleryImages[0]` de `src/data/site.ts`,
  qui deviennent `string | undefined`. Correction : `as const satisfies readonly string[]` sur
  `galleryImages`. TypeScript connaît alors la longueur exacte, les index valides restent typés
  `string` et un index hors bornes devient une erreur de compilation.

**Vérification :** `next build` n'affiche plus aucun `ƒ` ; `tsc --noEmit` passe avec les quatre
options.

---

### Vague 3 — SEO

Ajouts purs, sans modification de l'existant.

- `src/app/sitemap.ts` — `/`, `/prints`, et les trois `/services/[slug]` générés depuis
  `services` de `src/data/site.ts`, pour que l'ajout d'un service alimente automatiquement le
  sitemap.
- `src/app/robots.ts` — autorisation générale et référence au sitemap.
- `alternates.canonical` sur chaque page. Aucune page n'en a aujourd'hui.
- Open Graph complété : `url`, `type: "website"`, `locale: "en_GB"`, `siteName`. Actuellement
  `og:image` suit l'en-tête `Host`, ce qui produit `http://localhost:3000/og.png` en
  développement et un domaine imprévisible en production.
- JSON-LD : `LocalBusiness` (zones Édimbourg et Paris), `Person`, et un `Service` avec `Offer`
  par prestation, alimenté par les champs `price` et `priceNote` déjà présents dans
  `src/data/site.ts`.
- `public/og.png` : régénérer en 1200 × 630. Le fichier actuel fait 944 Ko, mesure 1734 × 907
  mais est déclaré 1733 × 907 dans le layout.

**Vérification :** `/sitemap.xml` et `/robots.txt` répondent 200 ; un `<link rel="canonical">` est
présent sur chaque page ; le JSON-LD est valide.

---

### Vague 4 — Performance, UX et garde-fous

**Corriger Tailwind**

`src/app/globals.css` ouvre sur la syntaxe v3 (`@tailwind base/components/utilities`), que
Tailwind v4 n'interprète pas complètement : les utilitaires sont bien émis, mais le Preflight est
silencieusement absent. Mesure : 1 069 octets produits avec la syntaxe v3 contre 5 764 avec
`@import "tailwindcss"`.

Analyse d'impact du Preflight réintroduit, règle par règle :

| Règle Preflight | Impact |
|---|---|
| `* { margin: 0; padding: 0 }` | Aucun — `margin: 0` est déjà explicite, la mise en page repose sur `gap` |
| `h1–h6 { font-size: inherit }` | Aucun — les huit titres du projet ont une règle explicite |
| `ol, ul { list-style: none }` | Aucun — déjà appliqué à `.service-inclusions ol` |
| `img { height: auto }` | Aucun — `.detail-gallery img, .print-image img` imposent `height: 100%` |
| `input, textarea { border: 0; background: transparent }` | Aucun — déjà appliqué |
| `a { text-decoration: inherit }` | **Régression** — `.text-link` et `.back-link` reposent sur le soulignement par défaut |
| `html { line-height: 1.5 }` | À vérifier — décalages verticaux mineurs sur les éléments sans `line-height` |

La régression est certaine, et l'intention d'origine est démontrable : `globals.css:211-213`
applique `text-underline-offset: 6px` à `.text-link, .back-link`, propriété qui n'a d'effet que
s'il existe un soulignement. L'auteur voulait ces liens soulignés et s'appuyait sur le défaut du
navigateur, que le Preflight supprime.

Actions :

- Remplacer les trois directives par `@import "tailwindcss"`.
- Ajouter `text-decoration: underline` à la règle `.text-link, .back-link` existante
  (`globals.css:211`). Corrige la régression et rend explicite une intention jusqu'ici portée par
  le comportement par défaut du navigateur. Sans cela, ces liens ne se distingueraient plus que
  par la couleur au survol — également un défaut d'accessibilité.
- Après contrôle visuel, retirer du reset manuel (`globals.css:27-54`) les règles désormais
  couvertes par le Preflight : `box-sizing`, `a { color: inherit }`, `img`, et
  `button/input/select/textarea { font: inherit }`. Conserver `html`/`body`
  (`width`, `max-width`, `overflow-x`, couleurs, police) et `::selection`. Objectif : une seule
  source de vérité pour le reset.

**Performance**

- `src/components/Hero.tsx` rend le `<h1>` via framer-motion avec `initial={{ opacity: 0, y: 32 }}`,
  ce qui produit un HTML serveur contenant `style="opacity:0"`. L'élément LCP de la page d'accueil
  est donc invisible jusqu'à l'hydratation, et reste invisible si JavaScript échoue. Remplacer par
  une animation CSS partant de l'état visible. Effet de bord bénéfique : `SiteHeader` peut sortir
  de la frontière client.
- `/prints` charge six images pour 5,03 Mo sans aucun `loading="lazy"`. Ajouter `loading="lazy"`
  et `decoding="async"` à partir de la deuxième image, `fetchPriority="high"` sur la première, et
  des attributs `width`/`height` explicites.

**UX et structure**

- `src/app/not-found.tsx` et `src/app/error.tsx` — absents, la 404 et les erreurs affichent
  l'écran par défaut de Next.
- `SiteFooter` et pages `/legal/privacy` et `/legal/terms` (structure seule).
- Déplacer `SiteHeader` dans un layout partagé plutôt que de le répéter page par page.
- `src/components/BookingForm.tsx` : retirer la mention « Connect this form to your preferred
  inbox before publishing to receive enquiries. », visible par les visiteurs après envoi. Le
  message de confirmation reste, sans instruction technique.

**Garde-fous**

`.github/workflows/deploy.yml` déploie sur chaque push vers `main` sans aucune vérification.
Ajouter un job bloquant `eslint .`, `tsc --noEmit` puis `next build` en amont du déploiement.
C'est le filet de sécurité qui rend les trois vagues précédentes durables.

**Vérification :** poids total de `/prints` mesuré avant et après ; le `<h1>` est visible avec
JavaScript désactivé ; un commit cassant le lint ou les types échoue en CI.

---

## Risques

1. **`.text-link` perd son soulignement** — confirmé par analyse. Mitigation : règle explicite,
   posée dans la même vague.
2. **`line-height: 1.5` hérité du Preflight** — décalages verticaux possibles sur les éléments
   sans `line-height` explicite. Mitigation : le contrôle visuel défini ci-dessous.

**Méthode de contrôle visuel**, utilisée pour ce risque et pour le retrait du reset manuel :
avant de modifier `globals.css`, lancer le serveur de développement et capturer `/`, `/prints` et
`/services/weddings` en 1280 × 800 puis en 375 × 812. Refaire les six captures après chaque
modification et les comparer. Toute différence non attendue bloque la vague tant qu'elle n'est
pas expliquée.
3. **Images hébergées sur `leonie-moreau.designbykiara.com`** — domaine tiers, point unique de
   défaillance hors du contrôle du projet. Hors périmètre, mais documenté dans `AGENTS.md`.
4. **`npm ci` échoue sur Windows ARM** — `node_modules/workerd/install.js` refuse
   `win32 arm64`. Limite amont, non corrigeable ici. Contournement documenté :
   `npm ci --ignore-scripts`. Le CI Linux n'est pas concerné.
5. **`leoniemoreau.com` doit être rattaché au Worker Cloudflare** — sans domaine personnalisé
   actif, le canonical et le sitemap pointeront vers un domaine non servi. À faire avant ou
   pendant la vague 3.

## Critères de succès

- `next build` ne produit plus aucune route `ƒ` : tout est `○` ou `●`.
- `eslint .` : zéro erreur, zéro avertissement.
- `tsc --noEmit` passe avec `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`.
- `/sitemap.xml` et `/robots.txt` répondent 200 ; canonical et JSON-LD présents sur chaque page.
- Le `<h1>` de la page d'accueil est visible sans JavaScript.
- GitHub affiche le projet comme majoritairement TypeScript.
- Un commit qui casse le lint, les types ou le build ne peut plus être déployé.
