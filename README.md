# Léonie Moreau — portfolio

Site vitrine d'une photographe basée à Édimbourg et Paris.
Production : <https://leoniemoreau.com>

## Stack

- **Next.js 16.2.3** (App Router, Turbopack) — versions figées, ne pas mettre à jour sans raison
- **React 19.2.4**, **TypeScript 5** en mode `strict`
- **Tailwind CSS 4** pour quelques utilitaires ; l'essentiel du style est écrit à la main dans `src/app/globals.css`
- **OpenNext + Cloudflare Workers** pour le déploiement

## Démarrer

```bash
npm install
npm run dev
```

Le site tourne sur <http://localhost:3000>.

> **Windows ARM :** `npm ci` échoue dans le postinstall de `workerd`
> (`Unsupported platform: win32 arm64`). Utiliser
> `npm ci --ignore-scripts --no-audit --no-fund`. Le déploiement passe par le
> CI Linux, qui n'est pas concerné.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | ESLint (`next lint` n'existe plus depuis Next 16) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run preview` | Build OpenNext puis aperçu local dans workerd |
| `npm run deploy` | Build OpenNext puis déploiement Cloudflare |

## Contenu

Tout le contenu éditorial — services, tarifs, galeries, prints — vit dans
`src/data/site.ts`. Ajouter un service dans ce fichier crée automatiquement sa
page `/services/<slug>` et son entrée de sitemap. Aucun contenu n'est codé en
dur dans les composants.

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml` : lint,
typecheck et build doivent passer avant le déploiement Cloudflare.

Secrets requis sur le dépôt GitHub : `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`.

## Rendu

Toutes les routes sont statiques ou prérendues (`○` / `●` dans la sortie de
build). **N'appelez jamais `headers()`, `cookies()` ou `searchParams` dans
`src/app/layout.tsx`** : une API dynamique dans le layout racine bascule le
site entier en rendu à la demande et annule `generateStaticParams`.
