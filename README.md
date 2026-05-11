# Praful Singru Lab Website

Clean, professional academic lab website for the Praful Singru Lab, NISER Bhubaneswar.
Static HTML/CSS/JS — no build step, no framework, no dependencies.

## File Structure

```
praful-singru-lab/
├── index.html            ← Homepage (hero + neural animation)
├── research.html         ← Research themes
├── people.html           ← Team & alumni
├── publications.html     ← Publication list with year filter
├── join.html             ← Open positions & contact
└── assets/
    ├── style.css         ← Complete design system
    ├── components.js     ← Navbar, footer, neural canvas animation
    └── images/           ← Create this folder and add photos here
        └── praful-singru.png   ← PI headshot (replace)
```

## Quick Start

Open `index.html` directly in a browser, or run a local server:

```bash
cd praful-singru-lab
python3 -m http.server 8080
# visit http://localhost:8080
```

## GitHub Pages Deployment

1. Create a new **public** repository on GitHub
2. Push all files:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
3. Go to **Settings → Pages → Source: main / root → Save**
4. Site live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Adding Photos

Place images in `assets/images/`. Then replace placeholder divs:

**PI photo** (`people.html`):
```html
<!-- The <img> tag already points to assets/images/praful-singru.png -->
<!-- Just drop the file there and it will appear automatically -->
```

**Student photos** (`people.html`): Replace the SVG placeholder inside `.person-img`:
```html
<div class="person-img">
  <img src="assets/images/student-name.jpg" alt="Student Name" />
</div>
```

**Lab photo** (`index.html`): Replace `.about-img-ph` div:
```html
<img src="assets/images/lab-photo.jpg" alt="Lab" style="width:100%;height:100%;object-fit:cover;" />
```

**Research images** (`research.html`): Replace each `.research-img-ph` div:
```html
<img src="assets/images/research-01.jpg" alt="Description" style="width:100%;height:100%;object-fit:cover;" />
```

## Customising Content

| What | Where |
|---|---|
| Lab name / institution in nav & footer | `assets/components.js` → `NAV` and `FOOTER` constants |
| Email address | `assets/components.js` + `join.html` |
| Research themes | `research.html` |
| Student list | `people.html` |
| Publications | `publications.html` |
| Homepage featured pubs | `index.html` |
| Colors / fonts | `assets/style.css` → `:root` variables |

## Color Palette (CSS variables)

```css
--ink-deep:  #050a13   /* hero background */
--ink:       #09101c   /* text */
--gold:      #b8922a   /* accent */
--cream:     #f6f4ef   /* section backgrounds */
--muted:     #78889a   /* body text */
```

## Fonts
- **Cormorant Garamond** — headings (loaded from Google Fonts)
- **Outfit** — body text (loaded from Google Fonts)

Requires internet on first load. To self-host fonts, download from
https://gwfh.mranftl.com and update the `@import` at the top of `style.css`.
