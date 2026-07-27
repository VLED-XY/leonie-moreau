<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ce projet

Portfolio d'une photographe. Production : <https://leoniemoreau.com>.
Déploiement OpenNext + Cloudflare Workers, pas Vercel.

## Règles

- **Le contenu vit dans `src/data/site.ts`.** Ne jamais coder un service, un
  tarif ou une URL d'image en dur dans un composant.
- **L'URL de production vit dans `src/lib/site-url.ts`.** Ne jamais l'écrire
  ailleurs.
- **Le layout racine doit rester statique.** Pas de `headers()`, `cookies()`
  ni `searchParams` dans `src/app/layout.tsx` : cela bascule tout le site en
  rendu dynamique et annule `generateStaticParams`.
- **Le style est écrit à la main** dans `src/app/globals.css`. Tailwind est
  disponible mais peu utilisé ; suivre le style existant plutôt que de
  convertir en utilitaires.
- **Les images sont hébergées sur `leonie-moreau.designbykiara.com`**, un
  domaine tiers hors du contrôle du projet.

## Vérifier

```bash
npm run lint && npm run typecheck && npm run build
```

Le build doit afficher `○` ou `●` sur toutes les routes. Un `ƒ` signale une
régression du rendu statique.

## Environnement

- Node 22.
- Sur Windows ARM, `npm ci` échoue dans le postinstall de `workerd` ; utiliser
  `npm ci --ignore-scripts`.
- Appeler les binaires via `./node_modules/.bin/<bin>` : `npx next` récupère
  une autre version et se trompe de racine de workspace (le worktree est
  imbriqué dans le dépôt principal, donc deux lockfiles).
