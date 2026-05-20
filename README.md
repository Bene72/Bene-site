# Ben&Fit

Site vitrine de Benoit, coach CrossFit & Hyrox a Nantes.

## Structure

```text
.
├── index.html
├── images/
│   ├── BenAnd_Fit.png
│   ├── ChatGPT_Image_22_avr__2026__22_24_41.png
│   ├── DSC02698.jpg
│   ├── Le_Mans_Contest_wod1-254.jpg
│   └── LRSY_Throwdown_Crossfit_2k24__46_.jpg
├── package.json
└── vercel.json
```

## Modifier le site

Tout le contenu principal est dans `index.html`.

- Textes: modifier les sections HTML.
- Images: remplacer les fichiers dans `images/` en gardant les memes noms.
- Couleurs: modifier les variables CSS dans `:root`.
- Contact: le formulaire ouvre un email pre-rempli vers `contact@benfit.fr`.

## Tester en local

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Deploiement

Le depot peut etre deploye sur Vercel tel quel. La racine du site contient directement `index.html`, ce qui evite les problemes de chemins d'images.
