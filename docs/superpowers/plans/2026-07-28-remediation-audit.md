# Remédiation de l'audit AI-friendly — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corriger les constats de l'audit AI-friendly du portfolio leonie-moreau — rendu statique, SEO, performance, dette de dépôt — pour qu'un développeur ou un agent puisse reprendre le projet sans se faire piéger.

**Architecture:** Quatre vagues ordonnées par rayon d'impact. La vague 1 ne touche aucun fichier exécuté. La vague 2 rétablit le rendu statique et durcit TypeScript. La vague 3 ajoute le SEO, uniquement en création de fichiers. La vague 4 traite la performance, l'UX et pose le garde-fou CI qui rend les trois premières durables.

**Tech Stack:** Next.js 16.2.3 (App Router), React 19.2.4, TypeScript 5, Tailwind CSS 4, OpenNext + Cloudflare Workers, ESLint 9.

**Spec de référence:** `docs/superpowers/specs/2026-07-27-remediation-audit-design.md`

## Global Constraints

- **Domaine de production :** `https://leoniemoreau.com`. Jamais d'URL en dur ailleurs que dans `src/lib/site-url.ts`.
- **Ne pas mettre à jour** Next, React ou Tailwind. Les versions sont figées : `next@16.2.3`, `react@19.2.4`, `tailwindcss@^4`.
- **Pas de framework de test dans ce projet.** La vérification de chaque tâche passe par `./node_modules/.bin/eslint .`, `./node_modules/.bin/tsc --noEmit`, `./node_modules/.bin/next build` et l'inspection du HTML servi. Ne pas installer Vitest/Jest : c'est hors périmètre du spec.
- **Vérifier sans serveur quand c'est possible.** Une fois le rendu statique rétabli (Task 4), le build écrit le HTML final dans `.next/server/app/` : `index.html`, `prints.html`, `services/weddings.html`, `_not-found.html`. Les inspecter avec `grep` évite de lancer `next start` et supprime tout risque de conflit de port. Les étapes ci-dessous utilisent `next start` uniquement là où un vrai code HTTP est nécessaire.
- **Toujours appeler les binaires via `./node_modules/.bin/<bin>`.** `npx next` télécharge une autre version et se trompe de racine de workspace (le worktree est imbriqué dans le dépôt principal, donc deux lockfiles).
- **Sur Windows ARM, `npm ci` échoue** dans le postinstall de `workerd`. Utiliser `npm ci --ignore-scripts --no-audit --no-fund`. Le CI Linux n'est pas concerné.
- **Langue du site :** anglais. Tout texte visible par un visiteur est en anglais.
- **Ne jamais affirmer au visiteur qu'un message a été envoyé** tant que le formulaire n'a pas de backend.
- **Chaque commit** se termine par la ligne `Co-Authored-By: Claude <noreply@anthropic.com>`.
- **Une tâche = un commit.** Ne pas grouper.

---

## Structure des fichiers

**Créés :**

| Fichier | Responsabilité |
|---|---|
| `src/lib/site-url.ts` | Source unique de l'URL de production |
| `src/lib/metadata.ts` | Fabrique de métadonnées par page (canonical + Open Graph complet) |
| `src/components/StructuredData.tsx` | Graphe JSON-LD schema.org |
| `src/components/SiteFooter.tsx` | Pied de page global |
| `src/app/sitemap.ts` | Sitemap généré depuis `src/data/site.ts` |
| `src/app/robots.ts` | robots.txt |
| `src/app/not-found.tsx` | Page 404 |
| `src/app/error.tsx` | Écran d'erreur (client component obligatoire) |
| `src/app/legal/privacy/page.tsx` | Politique de confidentialité |

**Modifiés :** `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/prints/page.tsx`, `src/app/services/[slug]/page.tsx`, `src/app/globals.css`, `src/components/Hero.tsx`, `src/components/BookingForm.tsx`, `src/data/site.ts`, `tsconfig.json`, `package.json`, `eslint.config.mjs`, `.gitignore`, `README.md`, `AGENTS.md`, `.github/workflows/deploy.yml`.

**Supprimés :** `scripts/prepare-open-next.mjs`, `public/{next,vercel,file,globe,window}.svg`, `build-log.txt`, `tailwindcss-33368.log`.

---

# Vague 1 — Dépôt (risque runtime nul)

### Task 1: Désindexer le code généré et les logs

`.open-next/` est couvert par `.gitignore:23` mais 10 de ses fichiers ont été ajoutés de force. Ils produisent les 3 seules erreurs ESLint du projet, polluent chaque recherche et faussent la barre de langages GitHub (163 Ko sur 165 Ko de « JavaScript »).

**Files:**
- Modify: `.gitignore`
- Modify: `eslint.config.mjs:9-15`
- Delete (index + disque): `build-log.txt`, `tailwindcss-33368.log`
- Delete (index seulement): `.open-next/**`

- [ ] **Step 1: Constater l'état de départ**

```bash
./node_modules/.bin/eslint . 2>&1 | tail -5
```
Attendu : `✖ 18 problems (3 errors, 15 warnings)`.

- [ ] **Step 2: Désindexer `.open-next/` sans le supprimer du disque**

```bash
git rm -r --cached .open-next
```
Attendu : 10 lignes `rm '.open-next/...'`.

- [ ] **Step 3: Supprimer les logs périmés, index et disque**

`tailwindcss-33368.log` décrit un état qui n'existe plus : il référence `src/components/Portfolio.tsx`, fichier supprimé, et le chemin `C:\Users\clara\Desktop\Projets VS Code\Léonie Moreau` d'un autre poste. Un agent qui le lit en tire des conclusions fausses.

```bash
git rm build-log.txt tailwindcss-33368.log
```

- [ ] **Step 4: Empêcher la réapparition des logs**

Dans `.gitignore`, remplacer le bloc `# debug` (lignes 29-33) par :

```gitignore
# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
*.log
build-log.txt
```

- [ ] **Step 5: Ignorer `.open-next/` côté ESLint**

Le dossier reste sur le disque après un build local. Remplacer `eslint.config.mjs` lignes 9-15 par :

```js
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build output — regenerated by `npm run deploy`, never edited by hand.
    ".open-next/**",
  ]),
```

- [ ] **Step 6: Vérifier que les 3 erreurs ont disparu**

```bash
./node_modules/.bin/eslint . 2>&1 | tail -5
```
Attendu : plus aucune erreur. Il reste 2 avertissements `no-img-element` (`prints/page.tsx:43`, `services/[slug]/page.tsx:59`), traités en Task 12.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: untrack build output and stale logs

.open-next/ was force-added despite .gitignore, producing the only ESLint
errors in the project and 163 KB of the 165 KB GitHub counts as JavaScript.
The two logs describe a state that no longer exists.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Supprimer le code et les dépendances morts

**Files:**
- Delete: `scripts/prepare-open-next.mjs`, `public/next.svg`, `public/vercel.svg`, `public/file.svg`, `public/globe.svg`, `public/window.svg`
- Modify: `package.json`

- [ ] **Step 1: Vérifier que le script est bien orphelin**

```bash
grep -rn "prepare-open-next" --exclude-dir=node_modules --exclude-dir=.git . || echo "AUCUNE REFERENCE"
```
Attendu : `AUCUNE REFERENCE`. S'il existe une référence, arrêter et la traiter avant de supprimer.

- [ ] **Step 2: Supprimer le script orphelin**

Il n'est plus appelé par `package.json` et duplique `open-next.config.ts` — deux sources de vérité qui divergeront.

```bash
git rm scripts/prepare-open-next.mjs
```

- [ ] **Step 3: Vérifier que les SVG sont inutilisés**

```bash
grep -rn -E "next\.svg|vercel\.svg|file\.svg|globe\.svg|window\.svg" src/ || echo "AUCUN USAGE"
```
Attendu : `AUCUN USAGE`.

- [ ] **Step 4: Supprimer les SVG de create-next-app**

```bash
git rm public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
```

- [ ] **Step 5: Vérifier que les 3 dépendances sont inutilisées**

```bash
grep -rn -E "from \"(clsx|tailwind-merge|lucide-react)\"" src/ || echo "AUCUN IMPORT"
```
Attendu : `AUCUN IMPORT`. Ne pas toucher à `framer-motion` : `Hero.tsx` l'utilise encore, il sera retiré en Task 11.

- [ ] **Step 6: Désinstaller**

```bash
npm uninstall clsx tailwind-merge lucide-react --ignore-scripts --no-audit --no-fund
```

- [ ] **Step 7: Vérifier que le projet compile toujours**

```bash
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/eslint . 2>&1 | tail -3
```
Attendu : aucune erreur TypeScript, 2 avertissements `no-img-element`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: remove dead script, assets and dependencies

prepare-open-next.mjs stopped being called and duplicated open-next.config.ts.
The five SVGs ship with create-next-app and are referenced nowhere. clsx,
tailwind-merge and lucide-react are never imported.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Rendre la documentation exacte

Le README actuel est le boilerplate `create-next-app` : il décrit un déploiement Vercel et une police Geist que le projet n'utilise pas. Un agent qui le lit propose la mauvaise procédure.

**Files:**
- Modify: `README.md` (remplacement complet)
- Modify: `AGENTS.md` (ajout après la ligne 5)

- [ ] **Step 1: Réécrire `README.md`**

```markdown
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
```

- [ ] **Step 2: Enrichir `AGENTS.md`**

Ajouter après la ligne 5, sous le bloc `<!-- END:nextjs-agent-rules -->` :

```markdown

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
  rendu dynamique.
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
  une autre version et se trompe de racine de workspace.
```

- [ ] **Step 3: Vérifier**

```bash
grep -c "leoniemoreau.com" README.md AGENTS.md
```
Attendu : au moins 1 dans chaque fichier.

- [ ] **Step 4: Commit**

```bash
git add README.md AGENTS.md
git commit -m "$(cat <<'EOF'
docs: replace boilerplate README and document project rules

The README shipped by create-next-app described a Vercel deployment and a
font the project does not use. AGENTS.md now states where content lives, why
the root layout must stay static, and how to verify a change.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

# Vague 2 — Rendu statique et TypeScript

### Task 4: Rétablir le rendu statique

`src/app/layout.tsx` appelle `headers()` dans `generateMetadata`. Cette API dynamique dans le layout racine bascule **toutes** les routes en rendu à la demande et neutralise le `generateStaticParams` de `services/[slug]`.

**Files:**
- Create: `src/lib/site-url.ts`
- Create: `src/lib/metadata.ts`
- Modify: `src/app/layout.tsx` (remplacement complet)

**Interfaces:**
- Produces: `SITE_URL: string` depuis `@/lib/site-url` — consommé par les Tasks 6, 7 et 8.
- Produces: `pageMetadata({ title?, description, path }): Metadata` depuis `@/lib/metadata` — consommé par la Task 7.
- Produces: `SITE_NAME: string`, `DEFAULT_TITLE: string`, `DEFAULT_DESCRIPTION: string` depuis `@/lib/metadata`.

- [ ] **Step 1: Constater la régression**

```bash
./node_modules/.bin/next build 2>&1 | grep -E "^[┌├└]|^ƒ |^○ |^● "
```
Attendu : `ƒ` sur les quatre routes, et la légende `ƒ (Dynamic) server-rendered on demand`.

- [ ] **Step 2: Créer la source unique de l'URL**

`src/lib/site-url.ts` :

```ts
/**
 * Production origin, without a trailing slash.
 *
 * Overridable through NEXT_PUBLIC_SITE_URL so preview deployments do not
 * advertise the production canonical. Inlined at build time, which keeps the
 * root layout static — see docs/superpowers/specs/2026-07-27-remediation-audit-design.md
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://leoniemoreau.com";
```

- [ ] **Step 3: Créer la fabrique de métadonnées**

Next fusionne les métadonnées de façon superficielle : une page qui déclare `openGraph` remplace entièrement celui du layout. Cette fabrique évite de réécrire l'objet complet sur chaque page.

`src/lib/metadata.ts` :

```ts
import type { Metadata } from "next";

export const SITE_NAME = "Léonie Moreau";
export const DEFAULT_TITLE =
  "Léonie Moreau | Photographer in Edinburgh & Paris";
export const DEFAULT_DESCRIPTION =
  "Editorial photography for weddings, brands and culture in Edinburgh, Paris and beyond.";

const OG_IMAGE = {
  url: "/og.png",
  width: 1734,
  height: 907,
  alt: "Léonie Moreau — Photographer",
};

type PageMetadataInput = {
  /** Page title without the site suffix. Omit on the home page. */
  title?: string;
  description: string;
  /** Root-relative path, e.g. "/prints". Resolved against metadataBase. */
  path: string;
};

export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const socialTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: SITE_NAME,
      url: path,
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
```

- [ ] **Step 4: Rendre le layout statique**

Remplacer intégralement `src/app/layout.tsx` :

```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
} from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1734,
        height: 907,
        alt: "Léonie Moreau — Photographer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Note : la hauteur passe de 907 à la vraie valeur mesurée du fichier. L'ancien layout déclarait 1733 × 907 alors que `public/og.png` fait 1734 × 907.

- [ ] **Step 5: Vérifier que le rendu statique est rétabli**

```bash
./node_modules/.bin/next build 2>&1 | grep -E "^[┌├└]|Dynamic|Static|SSG"
```
Attendu : `○` sur `/`, `/_not-found` et `/prints`, `●` sur `/services/[slug]` avec les trois slugs `photo-shoot`, `weddings`, `events`. **Aucun `ƒ`.**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: restore static rendering by removing headers() from the root layout

generateMetadata called headers(), a dynamic API. In the root layout that
opts every route into on-demand rendering and cancels generateStaticParams
on /services/[slug]. Metadata is now static, with the origin resolved from
NEXT_PUBLIC_SITE_URL at build time.

Also corrects the declared og:image height: the file is 1734x907, not 1733x907.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Durcir TypeScript

**Files:**
- Modify: `tsconfig.json:2-24`
- Modify: `src/data/site.ts:11`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Constater les erreurs que les nouvelles options révèlent**

```bash
./node_modules/.bin/tsc -p tsconfig.json --noEmit --noUncheckedIndexedAccess --noUnusedLocals --noUnusedParameters --target ES2022 2>&1 | head -12
```
Attendu : 9 erreurs `TS2322: Type 'string | undefined' is not assignable to type 'string'`, aux lignes 40, 56 et 72 de `src/data/site.ts` — les tableaux `images` des trois services.

- [ ] **Step 2: Figer `galleryImages` en tuple**

`services` est typé `Service[]`, donc ses `images: string[]` refusent `string | undefined`. `as const` donne à TypeScript la longueur exacte du tableau : les index valides retrouvent le type `string` et un index hors bornes devient une erreur de compilation. Cela corrige aussi `prints`, qui ne remontait pas d'erreur mais dégradait silencieusement `image` en `string | undefined`.

Dans `src/data/site.ts` ligne 11, remplacer :

```ts
];
```

par :

```ts
] as const satisfies readonly string[];
```

- [ ] **Step 3: Activer les options dans `tsconfig.json`**

Remplacer `"target": "ES2017",` par :

```json
    "target": "ES2022",
```

et ajouter après `"strict": true,` :

```json
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
```

- [ ] **Step 4: Ajouter le script `typecheck`**

Dans `package.json`, après la ligne `"lint": "eslint",` :

```json
    "typecheck": "tsc --noEmit",
```

- [ ] **Step 5: Vérifier**

```bash
./node_modules/.bin/tsc --noEmit && echo "TYPECHECK OK" && ./node_modules/.bin/next build 2>&1 | grep -cE "^ƒ "
```
Attendu : `TYPECHECK OK` puis `0` — aucune route dynamique.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: harden TypeScript settings

Enables noUncheckedIndexedAccess, noUnusedLocals and noUnusedParameters, and
raises target to ES2022. galleryImages becomes a const tuple so indexed access
stays typed as string instead of degrading to string | undefined.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

# Vague 3 — SEO

### Task 6: Sitemap et robots.txt

Les deux répondent 404 aujourd'hui.

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Interfaces:**
- Consumes: `SITE_URL` depuis `@/lib/site-url` (Task 4), `services` depuis `@/data/site`.

- [ ] **Step 1: Confirmer les 404**

```bash
./node_modules/.bin/next build >/dev/null 2>&1 && ./node_modules/.bin/next start -p 3947 &
sleep 6
curl -s -o /dev/null -w "sitemap:%{http_code} robots:" http://localhost:3947/sitemap.xml
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3947/robots.txt
```
Attendu : `sitemap:404 robots:404`.

- [ ] **Step 2: Créer le sitemap**

Il est généré depuis `services`, donc l'ajout d'un service dans `src/data/site.ts` alimente le sitemap sans autre intervention.

`src/app/sitemap.ts` :

```ts
import type { MetadataRoute } from "next";
import { services } from "@/data/site";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/prints`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/legal/privacy`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];
}
```

- [ ] **Step 3: Créer robots.txt**

`src/app/robots.ts` :

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Vérifier**

```bash
pkill -f "next start" ; ./node_modules/.bin/next build >/dev/null 2>&1 && ./node_modules/.bin/next start -p 3947 &
sleep 6
curl -s http://localhost:3947/sitemap.xml | head -20
curl -s http://localhost:3947/robots.txt
pkill -f "next start"
```
Attendu : un XML contenant les six URL en `https://leoniemoreau.com`, et un robots.txt contenant `Allow: /` et `Sitemap: https://leoniemoreau.com/sitemap.xml`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: add sitemap and robots.txt

Both returned 404. Service URLs are derived from src/data/site.ts so adding a
service keeps the sitemap correct without a second edit.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: URLs canoniques et Open Graph par page

Aucune page n'a de canonical. `og:url`, `og:type`, `og:locale` et `og:site_name` sont absents.

**Files:**
- Modify: `src/app/page.tsx` (ajout d'un export `metadata`)
- Modify: `src/app/prints/page.tsx:7-11`
- Modify: `src/app/services/[slug]/page.tsx:12-23`

**Interfaces:**
- Consumes: `pageMetadata`, `DEFAULT_DESCRIPTION` depuis `@/lib/metadata` (Task 4).

- [ ] **Step 1: Page d'accueil**

Dans `src/app/page.tsx`, ajouter après les imports existants :

```tsx
import type { Metadata } from "next";
import { DEFAULT_DESCRIPTION, pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  description: DEFAULT_DESCRIPTION,
  path: "/",
});
```

- [ ] **Step 2: Page prints**

Dans `src/app/prints/page.tsx`, remplacer les lignes 7 à 11 par :

```tsx
export const metadata: Metadata = pageMetadata({
  title: "Prints",
  description:
    "Limited photographic prints by Léonie Moreau, produced to order on archival paper.",
  path: "/prints",
});
```

et ajouter l'import `import { pageMetadata } from "@/lib/metadata";` sous les imports existants.

- [ ] **Step 3: Pages service**

Dans `src/app/services/[slug]/page.tsx`, remplacer les lignes 12 à 23 par :

```tsx
export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return {};
  }

  return pageMetadata({
    title: service.name,
    description: service.introduction,
    path: `/services/${service.slug}`,
  });
}
```

et ajouter `import { pageMetadata } from "@/lib/metadata";` sous les imports existants.

- [ ] **Step 4: Vérifier le HTML servi**

```bash
./node_modules/.bin/next build >/dev/null 2>&1 && ./node_modules/.bin/next start -p 3947 &
sleep 6
for p in "" "prints" "services/weddings"; do
  echo "--- /$p"
  curl -s "http://localhost:3947/$p" | grep -oE '<link rel="canonical"[^>]*>|<meta property="og:(url|type|locale|site_name)"[^>]*>'
done
pkill -f "next start"
```
Attendu, pour chaque page : un `canonical` pointant vers `https://leoniemoreau.com` + le bon chemin, et les quatre balises `og:`. La page service doit afficher `canonical` = `https://leoniemoreau.com/services/weddings`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: add canonical URLs and complete Open Graph tags

No page declared a canonical, and og:url, og:type, og:locale and og:site_name
were missing. Next merges metadata shallowly, so a page that declares
openGraph replaces the layout's entirely — pageMetadata() builds the complete
object once instead of repeating it per page.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Données structurées JSON-LD

**Files:**
- Create: `src/components/StructuredData.tsx`
- Modify: `src/data/site.ts` (type `Service` + les trois entrées)
- Modify: `src/app/layout.tsx` (montage dans `<body>`)

**Interfaces:**
- Consumes: `SITE_URL` (Task 4), `services` depuis `@/data/site`.
- Produces: `<StructuredData />`, composant serveur sans props.
- Produces: champ `priceFrom: number` sur le type `Service`.

- [ ] **Step 1: Rendre les tarifs exploitables**

`price` vaut `"From £250 / €290"` — une chaîne destinée à l'affichage, que schema.org ne peut pas consommer. Ajouter un champ numérique plutôt que de l'extraire par expression régulière.

Dans `src/data/site.ts`, ajouter au type `Service` après `price: string;` :

```ts
  /** Entry price in GBP, for schema.org Offer. Keep in sync with `price`. */
  priceFrom: number;
```

Puis ajouter le champ à chaque service, après sa ligne `price` :

- photo-shoot : `priceFrom: 250,`
- weddings : `priceFrom: 1450,`
- events : `priceFrom: 350,`

- [ ] **Step 2: Créer le composant**

`JSON.stringify` peut produire la séquence `</script>` si une donnée contient `<`. L'échappement de `<` en `<` empêche la sortie du contexte script.

`src/components/StructuredData.tsx` :

```tsx
import { services } from "@/data/site";
import { SITE_URL } from "@/lib/site-url";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/metadata";

export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_NAME,
        jobTitle: "Photographer",
        url: SITE_URL,
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: `${SITE_NAME} Photography`,
        description: DEFAULT_DESCRIPTION,
        url: SITE_URL,
        image: `${SITE_URL}/og.png`,
        founder: { "@id": `${SITE_URL}/#person` },
        areaServed: [
          { "@type": "City", name: "Edinburgh" },
          { "@type": "City", name: "Paris" },
        ],
      },
      ...services.map((service) => ({
        "@type": "Service",
        "@id": `${SITE_URL}/services/${service.slug}#service`,
        name: service.name,
        description: service.shortDescription,
        url: `${SITE_URL}/services/${service.slug}`,
        provider: { "@id": `${SITE_URL}/#business` },
        offers: {
          "@type": "Offer",
          price: service.priceFrom,
          priceCurrency: "GBP",
          url: `${SITE_URL}/services/${service.slug}`,
        },
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
```

- [ ] **Step 3: Monter le composant**

Dans `src/app/layout.tsx`, ajouter l'import :

```tsx
import { StructuredData } from "@/components/StructuredData";
```

et rendre le composant dans `<body>` :

```tsx
      <body>
        <StructuredData />
        {children}
      </body>
```

- [ ] **Step 4: Vérifier que le JSON-LD est valide**

```bash
./node_modules/.bin/next build >/dev/null 2>&1 && ./node_modules/.bin/next start -p 3947 &
sleep 6
curl -s http://localhost:3947/ \
  | sed -n 's/.*<script type="application\/ld+json">\(.*\)<\/script>.*/\1/p' \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const g=JSON.parse(s);console.log('TYPES:',g['@graph'].map(n=>n['@type']).join(', '))})"
pkill -f "next start"
```
Attendu : `TYPES: Person, LocalBusiness, Service, Service, Service`. Une erreur de parsing signale un échappement défectueux.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: add schema.org structured data

Person, LocalBusiness and one Service per offering, generated from
src/data/site.ts. Adds a numeric priceFrom field so Offer carries a real
price instead of parsing it out of display copy.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

# Vague 4 — Performance, UX et garde-fous

### Task 9: Corriger Tailwind

`globals.css` ouvre sur la syntaxe v3, que Tailwind v4 n'interprète pas complètement : les utilitaires sont émis, mais le Preflight est silencieusement absent. Mesuré : 1 069 octets produits avec la syntaxe v3 contre 5 764 avec `@import "tailwindcss"`.

L'analyse règle par règle figure dans le spec. Une seule régression : `a { text-decoration: inherit }` supprime le soulignement de `.text-link` et `.back-link`, qui reposaient sur le défaut du navigateur. `globals.css:213` applique `text-underline-offset: 6px` à ces deux classes — propriété sans effet s'il n'y a pas de soulignement, ce qui prouve l'intention d'origine.

**Files:**
- Modify: `src/app/globals.css:1-3`, `:211-218`, `:770-782`

- [ ] **Step 1: Capturer l'état visuel de référence**

Lancer `./node_modules/.bin/next dev -p 3947`, puis capturer `/`, `/prints` et `/services/weddings` en 1280 × 800 et en 375 × 812. Conserver les six captures pour comparaison.

- [ ] **Step 2: Corriger l'import**

Remplacer les lignes 1 à 3 de `src/app/globals.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

par :

```css
@import "tailwindcss";
```

- [ ] **Step 3: Rendre le soulignement explicite**

Remplacer le bloc `globals.css:211-218` :

```css
.text-link,
.back-link {
  text-underline-offset: 6px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
```

par :

```css
.text-link,
.back-link {
  /* Tailwind's Preflight resets `a { text-decoration: inherit }`, so the
     browser default these links relied on is gone. Stated explicitly here —
     colour alone would not distinguish them. */
  text-decoration: underline;
  text-underline-offset: 6px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
```

- [ ] **Step 4: Neutraliser aussi les délais en mouvement réduit**

Le bloc `prefers-reduced-motion` neutralise `animation-duration` mais pas `animation-delay`. La Task 11 introduit une animation retardée ; sans cette ligne, le contenu resterait invisible pendant le délai. Dans le bloc `globals.css:775-781`, ajouter après `animation-iteration-count: 1 !important;` :

```css
    animation-delay: 0.01ms !important;
```

- [ ] **Step 5: Comparer les captures**

Reprendre les six captures et les comparer à celles du Step 1. Différences attendues : le soulignement de `.text-link` et `.back-link` est préservé, et de légers décalages verticaux là où aucun `line-height` explicite n'est défini (Preflight impose `line-height: 1.5` sur `html`). **Toute autre différence bloque la tâche** tant qu'elle n'est pas expliquée.

- [ ] **Step 6: Vérifier que les utilitaires fonctionnent toujours**

`src/app/page.tsx:9` est le seul usage de Tailwind du projet (`flex min-h-screen flex-col w-full`).

```bash
./node_modules/.bin/next build >/dev/null 2>&1 && grep -rl "min-h-screen" .next/static/css/ >/dev/null && echo "UTILITAIRES PRESENTS"
```
Attendu : `UTILITAIRES PRESENTS`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: use Tailwind v4 import syntax and restore link underlines

The v3 @tailwind directives silently dropped Preflight under Tailwind v4
(1069 bytes emitted versus 5764). Restoring it removes the browser-default
underline that .text-link and .back-link relied on, so it is now explicit —
text-underline-offset on those classes shows the underline was intended.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Retirer le reset manuel devenu redondant

Le reset manuel de `globals.css:27-54` compensait l'absence du Preflight. Maintenant qu'il est rétabli, ces règles existent en double — deux sources de vérité pour le même comportement.

**Files:**
- Modify: `src/app/globals.css:27-54`

- [ ] **Step 1: Retirer les règles couvertes par le Preflight**

Supprimer ces quatre blocs de `globals.css` :

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

```css
a {
  color: inherit;
}
```

```css
img {
  display: block;
  max-width: 100%;
}
```

```css
button,
input,
select,
textarea {
  font: inherit;
}
```

**Conserver** `html`, `html, body`, `body` et `::selection` : `width`, `max-width`, `overflow-x`, `scroll-behavior`, les couleurs, la police et le lissage ne sont pas dans le Preflight.

- [ ] **Step 2: Comparer les captures**

Reprendre les six captures du Step 1 de la Task 9. Attendu : **aucune différence**. Une différence signifie qu'une des règles supprimées n'était pas réellement couverte — la restaurer et documenter pourquoi.

- [ ] **Step 3: Vérifier**

```bash
./node_modules/.bin/next build 2>&1 | grep -cE "^ƒ "
```
Attendu : `0`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
refactor: drop hand-written reset rules now covered by Preflight

box-sizing, a { color: inherit }, the img rules and font: inherit on form
controls duplicated Preflight exactly. The html/body and ::selection rules
stay — Preflight does not set them.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Rendre le titre visible sans JavaScript et retirer framer-motion

`Hero.tsx` anime le bloc du `<h1>` avec `initial={{ opacity: 0, y: 32 }}`, ce qui produit un HTML serveur contenant `style="opacity:0"`. L'élément LCP de la page d'accueil est donc invisible jusqu'à l'hydratation, et le reste définitivement si JavaScript échoue.

`framer-motion` n'est importé que dans ce fichier : le convertir en CSS permet de retirer la dépendance et de refaire de `Hero` un composant serveur, ce qui sort aussi `SiteHeader` du bundle client.

**Files:**
- Modify: `src/components/Hero.tsx` (remplacement complet)
- Modify: `src/app/globals.css` (ajout après le bloc `.hero-aside`)
- Modify: `package.json`

- [ ] **Step 1: Constater le problème**

```bash
./node_modules/.bin/next build >/dev/null 2>&1 && ./node_modules/.bin/next start -p 3947 &
sleep 6
curl -s http://localhost:3947/ | grep -oE 'style="opacity:0[^"]*"' | head -3
pkill -f "next start"
```
Attendu : au moins une occurrence de `style="opacity:0;transform:translateY(32px)"`.

- [ ] **Step 2: Confirmer que framer-motion n'est utilisé que là**

```bash
grep -rln "framer-motion" src/
```
Attendu : uniquement `src/components/Hero.tsx`.

- [ ] **Step 3: Ajouter les animations CSS**

`hero-rise` n'anime que `transform`, jamais `opacity` : le texte du `<h1>` est peint dès la première frame, donc le LCP n'est plus retardé. `hero-fade` porte sur `.hero-aside`, qui n'est pas l'élément LCP ; `backwards` maintient l'opacité à 0 pendant le délai.

Dans `src/app/globals.css`, ajouter juste après le bloc `.hero-aside` :

```css
.hero-title-wrap {
  animation: hero-rise 800ms cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-aside {
  animation: hero-fade 700ms ease 350ms backwards;
}

@keyframes hero-rise {
  from {
    transform: translateY(32px);
  }
}

@keyframes hero-fade {
  from {
    opacity: 0;
  }
}
```

Note : `.hero-aside` existe déjà à la ligne 151 avec `padding-bottom: 8px`. Ajouter la déclaration `animation` à ce bloc existant plutôt que d'en créer un second.

- [ ] **Step 4: Convertir `Hero.tsx` en composant serveur**

Remplacer intégralement `src/components/Hero.tsx` :

```tsx
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export function Hero() {
  return (
    <section className="hero" id="top">
      <SiteHeader />

      <div className="hero-grid">
        <div className="hero-title-wrap">
          <p className="eyebrow">Photographer — Paris · Edinburgh</p>
          <h1>
            Léonie
            <span>Moreau</span>
          </h1>
        </div>

        <div className="hero-aside">
          <p className="hero-index">Editorial · Weddings · Events</p>
          <p className="hero-intro">
            Honest, artful photography for people, celebrations and culture.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="#contact">
              Book a shoot <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="#services">
              Explore services
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-rule" />
    </section>
  );
}
```

- [ ] **Step 5: Retirer la dépendance**

```bash
npm uninstall framer-motion --ignore-scripts --no-audit --no-fund
```

- [ ] **Step 6: Vérifier que le titre est servi visible**

```bash
./node_modules/.bin/next build >/dev/null 2>&1 && ./node_modules/.bin/next start -p 3947 &
sleep 6
curl -s http://localhost:3947/ | grep -c 'style="opacity:0'
curl -s http://localhost:3947/ | grep -oE '<h1>.{0,40}'
pkill -f "next start"
```
Attendu : `0` occurrence de `opacity:0`, et le `<h1>` contient bien « Léonie ».

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
perf: render the hero heading without JavaScript, drop framer-motion

The h1 is the home page LCP element and was served with opacity:0, staying
invisible until hydration and permanently if JS failed. The entrance is now a
CSS animation on transform only, so the text paints on the first frame.

framer-motion was imported nowhere else, so Hero returns to being a server
component and SiteHeader leaves the client bundle.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Chargement des images

`/prints` charge six images pour 5,03 Mo sans aucun `loading="lazy"` : `DSC_1559.jpg` 1,69 Mo, `DSC_7744.JPG` 1,36 Mo, `DSC_4717.jpeg` 0,66 Mo, `DSC_7854.JPG` 0,64 Mo, `DSC_2459.jpg` 0,40 Mo, `DSC_3226.jpg` 0,28 Mo.

**Files:**
- Modify: `src/app/prints/page.tsx:43`
- Modify: `src/app/services/[slug]/page.tsx:59-62`

- [ ] **Step 1: Mesurer l'état de départ**

```bash
grep -c 'loading="lazy"' src/app/prints/page.tsx || echo "0 lazy"
```
Attendu : `0 lazy`.

- [ ] **Step 2: Page prints**

Le conteneur `.print-image` impose déjà `aspect-ratio: 4 / 5`, donc il n'y a pas de CLS ; `width`/`height` servent de garde-fou si la CSS échoue. `next/image` est écarté tant que le choix Cloudflare Images n'est pas tranché — le commentaire de désactivation ESLint documente cette décision au lieu de laisser un avertissement permanent.

Remplacer la ligne 43 de `src/app/prints/page.tsx` :

```tsx
              <img src={print.image} alt={`${print.title} photographic print`} />
```

par :

```tsx
              {/* eslint-disable-next-line @next/next/no-img-element -- next/image is deferred pending a Cloudflare Images decision; see docs/superpowers/specs/2026-07-27-remediation-audit-design.md */}
              <img
                src={print.image}
                alt={`${print.title} photographic print`}
                width={1200}
                height={1500}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />
```

- [ ] **Step 3: Pages service**

Remplacer les lignes 59 à 62 de `src/app/services/[slug]/page.tsx` :

```tsx
            <img
              src={image}
              alt={`${service.name} photography by Léonie Moreau — ${index + 1}`}
            />
```

par :

```tsx
            {/* eslint-disable-next-line @next/next/no-img-element -- next/image is deferred pending a Cloudflare Images decision; see docs/superpowers/specs/2026-07-27-remediation-audit-design.md */}
            <img
              src={image}
              alt={`${service.name} photography by Léonie Moreau — ${index + 1}`}
              width={1200}
              height={1500}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
            />
```

- [ ] **Step 4: Vérifier**

```bash
./node_modules/.bin/eslint . 2>&1 | tail -3
./node_modules/.bin/next build >/dev/null 2>&1 && ./node_modules/.bin/next start -p 3947 &
sleep 6
curl -s http://localhost:3947/prints | grep -o 'loading="lazy"' | wc -l
pkill -f "next start"
```
Attendu : ESLint ne signale plus aucun avertissement, et `5` images en `lazy` sur les 6 de `/prints`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
perf: lazy-load below-the-fold images

/prints loaded six images totalling 5.03 MB eagerly. The first keeps
fetchPriority=high, the rest defer. Explicit dimensions guard against layout
shift if the aspect-ratio CSS ever fails to apply.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Pages 404 et erreur

Les deux écrans par défaut de Next s'affichent aujourd'hui, sans en-tête ni identité visuelle.

**Files:**
- Create: `src/app/not-found.tsx`
- Create: `src/app/error.tsx`

- [ ] **Step 1: Page 404**

`src/app/not-found.tsx` :

```tsx
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <main>
      <div className="page-shell">
        <SiteHeader />
        <section className="detail-hero prints-hero">
          <div>
            <p className="eyebrow">Error 404</p>
            <h1>Page not found.</h1>
          </div>
          <div className="detail-intro">
            <p>
              This page has moved or never existed. The work, services and
              prints are all still here.
            </p>
            <Link className="primary-button" href="/">
              Back to home <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Écran d'erreur**

Next impose un composant client pour `error.tsx`. Seul `reset` est déstructuré : déstructurer `error` sans l'utiliser déclencherait `noUnusedLocals`, activé en Task 5.

`src/app/error.tsx` :

```tsx
"use client";

import { SiteHeader } from "@/components/SiteHeader";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <div className="page-shell">
        <SiteHeader />
        <section className="detail-hero prints-hero">
          <div>
            <p className="eyebrow">Something went wrong</p>
            <h1>An error occurred.</h1>
          </div>
          <div className="detail-intro">
            <p>
              This page failed to load. Trying again usually resolves it.
            </p>
            <button className="primary-button" type="button" onClick={reset}>
              Try again <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Vérifier**

```bash
./node_modules/.bin/tsc --noEmit && echo "TYPECHECK OK"
./node_modules/.bin/next build >/dev/null 2>&1 && ./node_modules/.bin/next start -p 3947 &
sleep 6
curl -s -o /dev/null -w "404 status: %{http_code}\n" http://localhost:3947/cette-page-nexiste-pas
curl -s http://localhost:3947/cette-page-nexiste-pas | grep -oE '<h1>[^<]*'
pkill -f "next start"
```
Attendu : `404 status: 404` et `<h1>Page not found.`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: add branded 404 and error pages

Both routes fell back to Next's default screens, with no header and no way
back into the site.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: Pied de page et politique de confidentialité

Le site n'a aucun pied de page et aucune page légale.

**Files:**
- Create: `src/components/SiteFooter.tsx`
- Create: `src/app/legal/privacy/page.tsx`
- Modify: `src/app/layout.tsx` (montage dans `<body>`)
- Modify: `src/app/globals.css` (ajout en fin de fichier, avant le bloc `@media (prefers-reduced-motion: reduce)`)

**Interfaces:**
- Consumes: `pageMetadata` (Task 4).
- Produces: `<SiteFooter />`, composant serveur sans props.

- [ ] **Step 1: Créer le pied de page**

`new Date()` est évalué au build : la page reste statique.

`src/components/SiteFooter.tsx` :

```tsx
import Link from "next/link";
import { SITE_NAME } from "@/lib/metadata";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <span>
        © {year} {SITE_NAME}
      </span>
      <nav aria-label="Footer navigation">
        <Link href="/#services">Services</Link>
        <Link href="/prints">Prints</Link>
        <Link href="/legal/privacy">Privacy</Link>
      </nav>
    </footer>
  );
}
```

- [ ] **Step 2: Styler le pied de page**

Ajouter à `src/app/globals.css`, juste avant le bloc `@media (prefers-reduced-motion: reduce)` :

```css
.site-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 46px 5%;
  border-top: 1px solid var(--line);
  background: var(--white);
  color: var(--muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.site-footer nav {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
}

.site-footer a {
  text-decoration: none;
}

.site-footer a:hover {
  color: var(--accent);
}
```

- [ ] **Step 3: Monter le pied de page**

Dans `src/app/layout.tsx`, ajouter l'import `import { SiteFooter } from "@/components/SiteFooter";` et rendre le composant après `{children}` :

```tsx
      <body>
        <StructuredData />
        {children}
        <SiteFooter />
      </body>
```

- [ ] **Step 4: Créer la page de confidentialité**

Le texte décrit uniquement ce que le site fait réellement aujourd'hui. **Il doit être relu et validé par la propriétaire du site avant la mise en ligne** — cette page engage juridiquement.

`src/app/legal/privacy/page.tsx` :

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "How this website handles personal data and enquiries.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <main>
      <div className="page-shell">
        <SiteHeader />
        <Link className="back-link" href="/">
          ← Home
        </Link>
        <section className="detail-hero prints-hero">
          <div>
            <p className="eyebrow">Legal</p>
            <h1>Privacy.</h1>
          </div>
          <div className="detail-intro">
            <p>
              This page explains what happens to the information you share
              through this website.
            </p>
          </div>
        </section>
      </div>

      <section className="section print-info">
        <div>
          <p className="eyebrow">What is collected</p>
          <h2>Only what you send.</h2>
        </div>
        <div>
          <p>
            The booking form asks for your name, email address, the service you
            are interested in, an optional date and location, and your message.
            These details are used to answer your enquiry and for nothing else.
          </p>
          <p>
            This website sets no analytics and no advertising cookies. It is
            served by Cloudflare, which processes technical connection data such
            as your IP address in order to deliver the pages and protect the
            service.
          </p>
          <p>
            Photographs displayed on this site are served from
            leonie-moreau.designbykiara.com.
          </p>
          <p>
            You can ask for a copy of the information held about you, or ask for
            it to be deleted, by replying to any message exchanged about your
            enquiry.
          </p>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Vérifier**

```bash
./node_modules/.bin/next build 2>&1 | grep -E "legal|^[┌├└]"
./node_modules/.bin/next start -p 3947 &
sleep 6
curl -s -o /dev/null -w "privacy: %{http_code}\n" http://localhost:3947/legal/privacy
curl -s http://localhost:3947/ | grep -oE '<footer[^>]*>'
pkill -f "next start"
```
Attendu : `/legal/privacy` apparaît en `○` dans la sortie de build, répond 200, et un `<footer class="site-footer">` est présent sur la page d'accueil.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: add site footer and privacy page

The site had no footer and no legal page. The privacy copy describes only what
the site actually does today and needs the owner's review before launch.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

### Task 15: Formulaire fonctionnel par mailto et garde-fou CI

Le formulaire n'envoie rien : `handleSubmit` appelle seulement `setSubmitted(true)`. Le message affiché est rédigé pour un développeur (« Connect this form to your preferred inbox before publishing ») et reste visible par les visiteurs.

Le passage en `mailto:` rend le formulaire réellement fonctionnel sans backend, sans clé API et sans secret. Le backend prévu par la propriétaire remplacera ce mécanisme.

**Files:**
- Modify: `src/data/site.ts` (ajout de `CONTACT_EMAIL`)
- Modify: `src/components/BookingForm.tsx`
- Modify: `.github/workflows/deploy.yml` (remplacement complet)

**Interfaces:**
- Produces: `CONTACT_EMAIL: string` depuis `@/data/site`.

> **Prérequis :** l'adresse e-mail de contact doit être fournie par la propriétaire du site. Elle n'existe nulle part dans le dépôt ni dans son historique. Ne pas inventer d'adresse ; ne pas exécuter cette tâche sans elle.

- [ ] **Step 1: Déclarer l'adresse de contact**

Ajouter en tête de `src/data/site.ts` :

```ts
/** Enquiry inbox. Used by the booking form until a real backend exists. */
export const CONTACT_EMAIL = "<adresse fournie par la propriétaire>";
```

- [ ] **Step 2: Composer le mailto à la soumission**

Remplacer les lignes 1 à 22 de `src/components/BookingForm.tsx` :

```tsx
"use client";

import { FormEvent, useState } from "react";
import { CONTACT_EMAIL, services } from "@/data/site";

type BookingFormProps = {
  defaultService?: string;
  title?: string;
  intro?: string;
};

export function BookingForm({
  defaultService = "",
  title = "Let’s work together.",
  intro = "Tell me about your project and I’ll get back to you within 48 hours.",
}: BookingFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const subject = `Booking enquiry — ${value("service")}`;
    const body = [
      `Name: ${value("name")}`,
      `Email: ${value("email")}`,
      `Service: ${value("service")}`,
      `Preferred date: ${value("date") || "—"}`,
      `Location: ${value("location") || "—"}`,
      "",
      value("message"),
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
  }
```

- [ ] **Step 3: Remplacer le message destiné au développeur**

Le nouveau texte décrit ce qui vient de se produire, sans jamais affirmer que le message a été envoyé. Remplacer les lignes 79 à 83 :

```tsx
        {submitted && (
          <p className="form-note" role="status">
            Your email app should now be open with this enquiry ready to send.
            If nothing happened, write to {CONTACT_EMAIL} directly.
          </p>
        )}
```

- [ ] **Step 4: Bloquer le déploiement sur un échec de qualité**

Le workflow déploie aujourd'hui sur chaque push vers `main` sans aucune vérification. Remplacer intégralement `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

env:
  NEXT_PUBLIC_SITE_URL: https://leoniemoreau.com

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type-check
        run: npm run typecheck

      - name: Build
        run: npm run build

  deploy:
    needs: verify
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build & Deploy
        run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

- [ ] **Step 5: Vérifier**

```bash
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/eslint . && echo "QUALITE OK"
grep -c "Connect this form" src/components/BookingForm.tsx || echo "NOTE DEV SUPPRIMEE"
```
Attendu : `QUALITE OK` puis `NOTE DEV SUPPRIMEE`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: send booking enquiries by mailto and gate deploys on quality

The form previously did nothing and showed a developer-facing note to
visitors. Submitting now opens the visitor's mail client pre-filled, so
enquiries reach a real inbox with no backend. The confirmation never claims
the message was sent.

Deployment now requires lint, typecheck and build to pass first.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Vérification finale

Après la Task 15, contrôler les critères de succès du spec :

```bash
./node_modules/.bin/eslint . && echo "LINT OK"
./node_modules/.bin/typecheck 2>/dev/null || ./node_modules/.bin/tsc --noEmit && echo "TYPES OK"
./node_modules/.bin/next build 2>&1 | grep -E "^[┌├└]|^ƒ " ; echo "-- aucun ƒ attendu ci-dessus --"
git ls-files | wc -l
```

| Critère | Attendu |
|---|---|
| Routes dynamiques | Aucune (`ƒ` absent) |
| ESLint | 0 erreur, 0 avertissement |
| TypeScript | Passe avec les trois options strictes |
| `/sitemap.xml`, `/robots.txt` | 200 |
| Canonical + JSON-LD | Présents sur chaque page |
| `<h1>` sans JavaScript | Visible |
| Fichiers suivis | 47 → environ 39 |

---

## Écarts assumés par rapport au spec

Trois points du spec ne sont pas implémentés tels quels. Chacun est un choix, pas un oubli.

1. **`SiteHeader` n'est pas déplacé dans un layout partagé.** Les trois appels sont à des profondeurs différentes avec des contextes de padding différents : `.hero` n'a pas de padding horizontal, `.page-shell` en a 5 %. Unifier changerait le rendu de l'accueil ou celui des sous-pages. La duplication est d'une ligne par fichier et elle est porteuse de sens. La Task 11 apporte tout de même le bénéfice visé en sortant `SiteHeader` du bundle client.

2. **`/legal/terms` n'est pas créée.** Des conditions de réservation relèvent du contenu commercial que seule la propriétaire peut rédiger. Une page vide serait pire qu'une page absente. `/legal/privacy` est créée car elle décrit un traitement de données factuel et vérifiable.

3. **`public/og.png` n'est pas recompressé.** Le projet n'embarque aucune chaîne de traitement d'image et le fichier pèse 944 Ko. La dimension déclarée est corrigée en Task 4 (1734 × 907 au lieu de 1733 × 907), ce qui était le vrai défaut. La recompression reste une action manuelle : elle n'affecte pas le chargement des pages, uniquement le partage sur les réseaux sociaux.
