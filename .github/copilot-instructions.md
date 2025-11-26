# Instructions pour les agents IA - Portfolio Jonas Jungling

## Architecture du projet

Portfolio statique multi-pages en HTML/CSS/JavaScript vanilla :

- **3 pages principales** : `index.html` (accueil), `projects.html` (projets), `about.html` (à propos)
- **Pages détail** : dossier `/projects/` contient les pages individuelles de chaque projet
- **Styling** : Tailwind CSS via CDN + classes utilitaires personnalisées dans `assets/styles.css`
- **JavaScript** : Un seul fichier `assets/script.js` partagé par toutes les pages (gestion thème + animations scroll)
- **Pas de build** : Projet statique déployable directement (ex: Netlify)

## Structure HTML

Toutes les pages suivent le même modèle :

1. **Configuration Tailwind inline** dans `<head>` avec `darkMode: 'class'`
2. **Navbar sticky** identique sur toutes les pages avec logo gradient, liens de navigation et toggle thème
3. **Container principal** : `max-w-5xl mx-auto px-4` pour centrer le contenu
4. **Footer** avec année dynamique via JS

### Navbar Pattern

```html
<header
  class="border-b border-slate-200/70 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-30"
>
  <!-- Logo "J" avec gradient sky-500 to purple-500 -->
  <!-- Liens : projects.html, about.html, #contact -->
  <!-- Bouton theme-toggle avec icônes sun/moon -->
</header>
```

## Système de thème (clair/sombre)

**Mécanisme** : `assets/script.js` gère le thème via la classe `dark` sur `<html>` et `localStorage`

- Au chargement : vérifie `localStorage.getItem('theme')` ou `prefers-color-scheme`
- Toggle : ajoute/retire la classe `dark` sur `document.documentElement`
- **Tous les styles utilisent les variants Tailwind** : `dark:bg-slate-950`, `dark:text-slate-100`, etc.

**Important** : Toujours prévoir les variants `dark:` pour les nouvelles classes de couleur.

## Classes utilitaires personnalisées

Définies dans `assets/styles.css` avec `@apply` Tailwind :

### Badges & Composants

- `.badge-tech` : badge neutre générique
- `.badge-frontend` : badge bleu pour technos frontend
- `.badge-backend` : badge vert pour technos backend
- `.badge-database` : badge violet pour bases de données
- `.badge-tool` : badge ambre pour outils/langages
- `.tech-icon-badge` : badge avec icône de techno (pour cartes visuelles)

### Boutons

- `.btn-primary` : bouton CTA principal avec gradient sky-500 + hover scale
- `.btn-secondary` : bouton secondaire avec bordure
- `.btn-ghost` : bouton fantôme pour actions tertiaires
- `.btn-card-primary` : bouton primaire pour cartes projet visuelles
- `.btn-card-secondary` : bouton icône secondaire pour cartes projet

### Cartes et Layouts

- `.project-card` : cartes de projet simples avec hover effect et shadow
- `.project-card-visual` : **cartes visuelles avec thumbnail** pour page projets (grid layout)
- `.project-title`, `.project-meta`, `.project-text` : typographie standardisée
- `.project-tags` : container flex pour les badges
- `.project-hero` : bannière hero pour pages détail projet
- `.screenshot-grid` : grille pour screenshots (1 col mobile, 2 cols desktop)
- `.section-spacing` : espacement entre sections (mt-16 sm:mt-20 lg:mt-24)
- `.cards-grid` : grille 2 colonnes responsive
- `.cards-grid-3` : grille 3 colonnes responsive (2 sur tablet, 3 sur desktop)

### Filtres et interactions

- `.filter-btn` : boutons de filtre pour catégoriser les projets
- `.filter-btn.active` : état actif du filtre avec gradient et shadow

### Animations

- `.animate-fade-up` : animation entrée depuis le bas (gérée par Intersection Observer dans script.js)

### Utilitaires

- `.line-clamp-2` : limitation texte à 2 lignes avec ellipse

**Structure carte projet visuelle** :

```html
<article class="project-card-visual group" data-category="fullstack">
  <div class="relative overflow-hidden rounded-t-2xl aspect-video">
    <img src="assets/img/projet.png" alt="Projet" />
    <div class="absolute top-3 right-3">
      <span class="badge">Badge optionnel</span>
    </div>
  </div>
  <div class="p-6">
    <h2>Titre</h2>
    <p class="line-clamp-2">Description courte</p>
    <div class="flex gap-2">
      <span class="tech-icon-badge">
        <img src="assets/logo/tech.png" class="w-4 h-4" />
        Tech
      </span>
    </div>
    <div class="flex gap-2">
      <a href="projects/detail.html" class="btn-card-primary flex-1">Voir →</a>
      <a href="#" class="btn-card-secondary">🎥</a>
    </div>
  </div>
</article>
```

## Palette de couleurs

- **Primaire** : `sky-500` à `sky-600` (bleu ciel)
- **Accent** : `purple-500` (gradient avec sky)
- **Neutre** : gamme `slate-` (50, 100, 200...950)
- **Convention** : toujours utiliser les teintes slate pour les fonds, bordures et textes neutres
- **Contrastes** : textes en `slate-700` (light) / `slate-200` (dark) pour meilleure lisibilité

## Ajout de nouveau contenu

### Ajouter un projet

1. **Page liste** (`projects.html`) : dupliquer un `<article class="project-card-visual">` avec :

   - Image/thumbnail dans le conteneur `aspect-video` en haut
   - Badge optionnel (Flagship, Hardcore, etc.) en position absolute
   - Titre + année dans l'en-tête
   - Description courte (2 lignes max avec `line-clamp-2`)
   - Technologies avec `.tech-icon-badge` + logo dans `assets/logo/`
   - Boutons : `.btn-card-primary` pour détail + `.btn-card-secondary` pour démo/GitHub
   - Attribut `data-category` pour le système de filtres

2. **Page d'accueil** (`index.html`) : mettre à jour les 3 projets mis en avant dans `.cards-grid-3`

3. **Page détail** : créer `/projects/nom-projet.html` avec structure :
   - Breadcrumb de navigation
   - `.project-hero` en haut
   - Sections : Overview, Stack technique, Features, Défis techniques
   - CTA pour démo/code
   - Navigation retour

### Ajouter une compétence

Éditer `index.html`, section `#skills` : dupliquer un bloc avec structure `<div class="rounded-2xl border...">`.

## Script JavaScript

`assets/script.js` contient :

1. **Theme management** : `setTheme()`, `initTheme()`, event listener sur `#theme-toggle`
2. **Footer year** : remplit automatiquement `#year` avec l'année courante
3. **Scroll animations** : Intersection Observer pour `.animate-fade-up` sur sections et cartes

**Éviter** : charger des frameworks lourds. Le site privilégie la légèreté et la rapidité.

## Conventions de code

- **Langue** : Contenu en français, commentaires HTML en français
- **Indentation** : 2 espaces
- **IDs vs classes** : IDs pour les éléments JS (`theme-toggle`, `year`) et ancres (`#contact`, `#skills`), classes Tailwind pour le style
- **Responsive** : mobile-first, breakpoints `sm:`, `md:`, `lg:` Tailwind
- **Accessibilité** : `lang="fr"`, `scroll-smooth`, structure sémantique (`<header>`, `<main>`, `<footer>`, `<article>`, `<section>`)
- **Espacements** : utiliser `.section-spacing` pour espacements verticaux cohérents entre sections

## Architecture UX/UI

### Hiérarchie visuelle

- **Titres** : `text-2xl sm:text-3xl font-bold` pour sections principales
- **CTA primaire** : toujours visible, bouton gradient avec icône
- **Espacement** : généreux (spacing-6 à spacing-8 entre éléments)
- **Hover states** : toutes les cartes et boutons ont des effets au survol

### Pages détail projet

Structure standardisée :

1. Hero avec titre + description
2. Grid d'infos (Période / Type / Contexte)
3. Stack technique avec badges colorés
4. Features en grid 2 colonnes
5. Défis techniques avec bordure colorée à gauche
6. CTA démo/code centré avec fond coloré
7. Navigation (retour projets + contact)

## Déploiement

- **Plateforme cible** : Netlify (ou tout hébergement statique)
- **Pas de build** : les fichiers sont prêts à déployer directement
- **Assets** : fichiers statiques dans `/assets/` (CSS, JS) et `/projects/` (pages détail)
- **CV** : prévoir `/assets/cv/` pour le CV PDF

## Évolutions futures

Si ajout de fonctionnalités :

- Garder la philosophie "vanilla" sans frameworks si possible
- Privilégier Tailwind + HTML sémantique
- Conserver le système de thème existant
- Toute nouvelle page doit inclure la navbar et le footer standard
- Respecter le système de badges colorés par catégorie (frontend/backend/database/tool)
