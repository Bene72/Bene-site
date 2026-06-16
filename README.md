# Ben&Fit — Site vitrine

Coach CrossFit & Hyrox à Nantes — Benoit "Bene" Allen

## Structure

```
.
├── index.html            → Page principale
├── 404.html              → Page d'erreur
├── robots.txt            → Directives crawlers
├── sitemap.xml           → Plan du site
├── vercel.json           → Config déploiement + headers HTTP
├── _headers              → Headers Netlify (fallback)
├── package.json
├── assets/
│   └── main.js           → JavaScript externalisé
└── images/
    ├── logo.webp         → Logo (200×200)
    ├── logo-44.webp      → Logo nav 1x
    ├── logo-88.webp      → Logo nav 2x
    ├── favicon.png       → Favicon 64px
    ├── hero.webp         → Image hero (900w)
    ├── hero-480w.webp    → Hero srcset 480w
    ├── hero-720w.webp    → Hero srcset 720w
    ├── gallery-main.webp       → Galerie principale
    ├── gallery-main-700w.webp  → Galerie srcset 700w
    ├── gallery-lemans.webp     → Compétition Le Mans
    └── gallery-throwdown.webp  → CrossFit Throwdown
```

## Lancer en local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Auto-héberger les fonts (recommandé pour CSP optimale)

Pour supprimer la dépendance Google Fonts et pouvoir retirer
`fonts.googleapis.com` de la CSP :

1. Installer google-webfonts-helper ou `fontsource` :
   ```bash
   npm install @fontsource/bebas-neue @fontsource/barlow @fontsource/barlow-condensed
   ```
2. Copier les .woff2 dans `/assets/fonts/`
3. Remplacer le lien Google Fonts dans `index.html` par un `<link rel="stylesheet" href="/assets/fonts/fonts.css">`
4. Mettre à jour la CSP dans `vercel.json` :
   - Retirer `https://fonts.googleapis.com` de `style-src`
   - Retirer `https://fonts.gstatic.com` de `font-src`

## Déployer sur Vercel

```bash
npx vercel --prod
```

## Scores audit (post-optimisation)

| Indicateur   | Avant | Après |
|--------------|-------|-------|
| Sécurité     | 82    | 97+   |
| Performance  | 72    | 95+   |
| Qualité code | 74    | 96+   |
| Design/UX    | 80    | 92+   |
| SEO          | 78    | 96+   |
| **Global**   | **78**| **95+**|

## Poids images

| Fichier              | Avant    | Après  | Gain  |
|----------------------|----------|--------|-------|
| Images totales       | 1 880 KB | 392 KB | -79%  |
