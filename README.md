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
Sans ces secrets, le workflow produit uniquement l’artefact `cloudflare-build`
(archive de `.open-next`) et signale qu’un déploiement manuel reste nécessaire.
Il peut également être lancé manuellement. Cet artefact Linux permet de déployer
depuis Windows après extraction à la racine du même commit, avec
`OPEN_NEXT_DEPLOY=true` puis `./node_modules/.bin/wrangler deploy`.

### Formulaire de réservation

`worker.mjs` traite `POST /api/booking` avant de déléguer les autres requêtes à
OpenNext. Les pages Next.js restent statiques. L’envoi utilise l’API Resend,
avec une adresse de réponse correspondant au visiteur.

Configurer sur le Worker les secrets `RESEND_API_KEY`, `BOOKING_FROM_EMAIL`
(expéditeur sur un domaine vérifié dans Resend) et `BOOKING_TO_EMAIL`
(destinataire fixe). Ne jamais utiliser de variable `NEXT_PUBLIC_` pour ces valeurs.
Les déploiements Wrangler conservent les secrets existants.

La validation serveur, un champ piège et les bindings de limitation de débit
protègent l’envoi. Les tentatives identiques réutilisent une clé d’idempotence
Resend. Les limites Cloudflare s’appliquent par point de présence.

`npm test` vérifie le traitement sans envoyer d’e-mail. Pour essayer le
formulaire complet en local, utiliser `npm run preview` avec les trois valeurs
dans un fichier `.dev.vars` ignoré par Git ; `next dev` seul ne lance pas le
gestionnaire Cloudflare. Ne jamais committer de clé Resend.

## Rendu

Toutes les routes sont statiques ou prérendues (`○` / `●` dans la sortie de
build). **N'appelez jamais `headers()`, `cookies()` ou `searchParams` dans
`src/app/layout.tsx`** : une API dynamique dans le layout racine bascule le
site entier en rendu à la demande et annule `generateStaticParams`.
