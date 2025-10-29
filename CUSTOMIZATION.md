# Customization Guide

This guide explains how to customize the Lukeforge website to match your brand and content.

## Table of Contents

- [Colors & Branding](#colors--branding)
- [Logo Replacement](#logo-replacement)
- [Typography](#typography)
- [Content Updates](#content-updates)
- [3D Scene Customization](#3d-scene-customization)
- [Adding New Sections](#adding-new-sections)
- [CMS Integration](#cms-integration)

## Colors & Branding

### Color Palette

All colors are defined in `src/styles/main.css` using CSS custom properties:

```css
:root {
  /* Primary Colors - Dark Blue & Black Theme */
  --color-bg: #0A0E27;           /* Dark blue-black background */
  --color-accent: #0EA5E9;        /* Electric blue accent */
  --color-text: #F0F9FF;          /* Ice white text */
  --color-text-dim: #94A3B8;      /* Muted text */
  
  /* Surface Colors */
  --color-surface: #1A1F3A;       /* Card backgrounds */
  --color-surface-hover: #252B47; /* Hover state */
  --color-border: #2A3154;        /* Borders */
}

/* Light mode overrides */
[data-theme="light"] {
  --color-bg: #F0F9FF;
  --color-text: #0A0E27;
  --color-surface: #FFFFFF;
  --color-border: #DBEAFE;
  --color-text-dim: #64748B;
  --color-surface-hover: #F1F5F9;
}
```

### Changing Brand Colors

1. **Update CSS Variables** (`src/styles/main.css`):
   ```css
   :root {
     --color-bg: #YourDarkColor;
     --color-accent: #YourBrandColor;
     --color-text: #YourTextColor;
   }
   ```

2. **Update 3D Scene Colors** (`src/components/Hero3DText.js`):
   ```javascript
   const material = new THREE.MeshStandardMaterial({
     color: 0xYourTextColor,    // Hex without #
     emissive: 0xYourAccent,
     emissiveIntensity: 0.2,
   });
   ```

3. **Update Particle Colors** (`src/components/ParticleField.js`):
   ```javascript
   const color1 = new THREE.Color(0x0EA5E9); // Current: Electric Blue
   const color2 = new THREE.Color(0xF0F9FF); // Current: Ice White
   
   // Change to your colors:
   const color1 = new THREE.Color(0xYourAccent);
   const color2 = new THREE.Color(0xYourTextColor);
   ```

4. **Update Logo SVG** (`public/logo.svg`):
   - Replace `fill="#F8FAFF"` with your text color
   - Replace `fill="#FF7A00"` with your accent color

## Logo Replacement

### Option 1: Update SVG Logo

Replace `public/logo.svg` with your logo:

```svg
<svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Your logo paths here -->
</svg>
```

**Requirements**:
- Width: ~180px (adjust as needed)
- Height: ~40px (maintain aspect ratio)
- Use `fill="currentColor"` for theme-aware coloring

### Option 2: Use PNG/WebP Logo

1. Export your logo as PNG or WebP
2. Update `src/index.html`:
   ```html
   <img src="/logo.png" alt="Your Company" class="logo-image" width="180" height="40">
   ```

### Update Favicon

1. **Create Favicon**:
   - Design 32x32px icon
   - Export as SVG: `public/favicon.svg`
   - Convert to ICO: Use [favicon.io](https://favicon.io/) or [realfavicongenerator.net](https://realfavicongenerator.net/)

2. **Replace Files**:
   ```
   public/
   ├── favicon.ico       # For older browsers
   ├── favicon.svg       # Modern browsers
   └── favicon-32x32.png # Fallback
   ```

### Update OpenGraph Image

1. **Create OG Image** (1200x630px):
   - Design in Figma, Canva, or Photoshop
   - Include logo, tagline, and brand colors
   - Export as PNG or WebP

2. **Replace**:
   ```
   public/og-image.png
   ```

3. **Update meta tags** (`src/index.html`):
   ```html
   <meta property="og:image" content="https://yoursite.com/og-image.png">
   ```

## Typography

### Changing Fonts

Currently using **Inter** from Google Fonts. To change:

1. **Select Font** from [Google Fonts](https://fonts.google.com/)

2. **Update HTML** (`src/index.html`):
   ```html
   <link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
   ```

3. **Update CSS** (`src/styles/main.css`):
   ```css
   :root {
     --font-primary: 'YourFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
   }
   ```

### Font Weights

Adjust weights in CSS variables:

```css
:root {
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}
```

## Content Updates

### Company Information

Update these files with your company details:

#### 1. HTML Meta Tags (`src/index.html`)

```html
<title>Your Company | Your Tagline</title>
<meta name="description" content="Your company description">
<meta name="keywords" content="your, keywords, here">

<meta property="og:title" content="Your Company | Your Tagline">
<meta property="og:description" content="Your description">
```

#### 2. Hero Section (`src/index.html`)

```html
<h1 class="hero-title">
  <span class="hero-subtitle">Your Tagline</span>
</h1>
<p class="hero-description">
  Your compelling description here.
</p>
```

#### 3. Footer Information (`src/index.html`)

```html
<div class="footer-brand">
  <p>Your company description.</p>
</div>

<!-- Contact info -->
<p>123 Your Street<br>Your City, ST 12345</p>
<p><a href="mailto:hello@yourcompany.com">hello@yourcompany.com</a></p>
<p><a href="tel:+1234567890">+1 (234) 567-890</a></p>
```

### Services

Edit `src/sections/Services.js`:

```javascript
export const servicesData = [
  {
    id: 'unique-id',
    title: 'Service Name',
    description: 'Service description explaining what you offer.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <!-- Your SVG icon code -->
      <path d="..."/>
    </svg>`,
  },
  // Add more services...
];
```

**Icon Resources**:
- [Heroicons](https://heroicons.com/)
- [Feather Icons](https://feathericons.com/)
- [Lucide Icons](https://lucide.dev/)

### Portfolio Projects

Edit `src/sections/Portfolio.js`:

```javascript
export const portfolioData = [
  {
    id: 'project-slug',
    title: 'Project Name',
    description: 'Detailed project description for the modal view.',
    tags: ['Technology', 'Stack', 'Used'],
    image: 'https://yourimage.com/project.jpg', // Or '/images/project.jpg'
    color: 0x4F46E5, // Hex color for 3D preview (no #)
  },
  // Add more projects...
];
```

**Image Tips**:
- Use high-quality images (at least 800x600)
- Aspect ratio: 4:3 works best
- Use Unsplash for placeholder images
- Compress with [TinyPNG](https://tinypng.com/)
- Convert to WebP for better performance

### About Timeline

Edit `src/sections/Contact.js`:

```javascript
export const timelineData = [
  {
    year: '2025',
    title: 'Milestone Title',
    description: 'What happened this year.',
  },
  {
    year: '2024',
    title: 'Another Milestone',
    description: 'Description of the event.',
  },
  // Add more events (reverse chronological order)
];
```

### About Story

Edit `src/index.html`, find the `.about-story` section:

```html
<div class="about-story">
  <h3>Our Story</h3>
  <p>
    Your company origin story, mission, and vision.
  </p>
  <p>
    Additional paragraphs about your values and approach.
  </p>
</div>
```

## 3D Scene Customization

### Changing 3D Text

In `src/components/Hero3DText.js`:

```javascript
// Change text
const textGeometry = new TextGeometry('YOUR TEXT', {
  font: font,
  size: 0.8,              // Text size
  height: 0.2,            // Extrusion depth
  curveSegments: 12,      // Smoothness
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.02,
  bevelSegments: 5,
});

// Change material
const material = new THREE.MeshStandardMaterial({
  color: 0xF8FAFF,        // Base color
  metalness: 0.3,         // 0-1 (more metallic)
  roughness: 0.4,         // 0-1 (more rough)
  emissive: 0xFF7A00,     // Glow color
  emissiveIntensity: 0.2, // Glow strength
});
```

### Modifying Particles

In `src/components/ParticleField.js`:

```javascript
// Particle count
const particleCount = 1500; // Increase/decrease particles

// Particle colors
const color1 = new THREE.Color(0xFF7A00);  // Accent
const color2 = new THREE.Color(0xF8FAFF);  // Main
const color3 = new THREE.Color(0x0F172A);  // Background

// Particle size
sizes[i] = Math.random() * 3 + 0.5; // Range: 0.5-3.5

// Particle speed
velocities[i3] = (Math.random() - 0.5) * 0.05; // Faster/slower
```

### Changing the Forge Object

In `src/main.js`, `addForgeObject()` function:

```javascript
// Replace TorusKnotGeometry with other shapes:

// Sphere
const geometry = new THREE.SphereGeometry(1, 32, 32);

// Box
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Dodecahedron (low-poly)
const geometry = new THREE.DodecahedronGeometry(1);

// Load custom model
const loader = new GLTFLoader();
loader.load('/models/your-model.glb', (gltf) => {
  sceneManager.add(gltf.scene);
});
```

### Adjusting Lighting

In `src/components/SceneManager.js`:

```javascript
// Ambient light (general illumination)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color, Intensity

// Directional light (sun-like)
const directionalLight = new THREE.DirectionalLight(0xFF7A00, 1.5);
directionalLight.position.set(5, 5, 5); // X, Y, Z position

// Point light (lamp-like)
const accentLight = new THREE.PointLight(0xFF7A00, 2, 20); // Color, Intensity, Distance
accentLight.position.set(-3, 2, 3);
```

## Adding New Sections

### 1. Create Section File

Create `src/sections/YourSection.js`:

```javascript
export const yourData = [
  {
    id: 'item-1',
    title: 'Item Title',
    content: 'Item content',
  },
];

export function renderYourSection() {
  const container = document.getElementById('your-section-grid');
  if (!container) return;
  
  container.innerHTML = yourData.map(item => `
    <div class="your-item">
      <h3>${item.title}</h3>
      <p>${item.content}</p>
    </div>
  `).join('');
}
```

### 2. Add HTML Section

In `src/index.html`, add after existing sections:

```html
<section id="your-section" class="section your-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Your Section</h2>
      <p class="section-description">
        Section description
      </p>
    </div>
    <div id="your-section-grid" class="your-grid">
      <!-- Content injected by JavaScript -->
    </div>
  </div>
</section>
```

### 3. Add Styles

In `src/styles/main.css`:

```css
.your-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.your-item {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: all var(--transition-base);
}

.your-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

### 4. Initialize Section

In `src/main.js`:

```javascript
import { renderYourSection } from './sections/YourSection.js';

// In DOMContentLoaded:
renderYourSection();
```

### 5. Add Navigation Link

In `src/index.html`, navigation menu:

```html
<ul class="nav-menu" role="menubar">
  <!-- ... existing links ... -->
  <li role="none"><a href="#your-section" role="menuitem">Your Section</a></li>
</ul>
```

## CMS Integration

### Contentful Setup

```bash
npm install contentful
```

Create `src/services/contentful.js`:

```javascript
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: process.env.VITE_CONTENTFUL_ACCESS_TOKEN
});

export async function getServices() {
  const response = await client.getEntries({
    content_type: 'service'
  });
  
  return response.items.map(item => ({
    id: item.sys.id,
    title: item.fields.title,
    description: item.fields.description,
    icon: item.fields.icon,
  }));
}
```

Update `src/sections/Services.js`:

```javascript
import { getServices } from '../services/contentful.js';

export async function renderServices() {
  const container = document.getElementById('services-grid');
  if (!container) return;
  
  // Show loading state
  container.innerHTML = '<p>Loading services...</p>';
  
  try {
    const services = await getServices();
    
    container.innerHTML = services.map(service => `
      <div class="service-card">
        <div class="service-icon">${service.icon}</div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load services:', error);
    container.innerHTML = '<p>Failed to load services.</p>';
  }
}
```

Add environment variables (`.env.local`):

```env
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token
```

### Sanity Setup

```bash
npm install @sanity/client
```

Create `src/services/sanity.js`:

```javascript
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export async function getPortfolio() {
  const query = `*[_type == "portfolio"]{
    _id,
    title,
    description,
    tags,
    "image": image.asset->url,
    color
  }`;
  
  return await client.fetch(query);
}
```

## Advanced Customization

### Custom Shaders

For advanced 3D effects, modify shaders in `src/components/ParticleField.js`:

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    colorA: { value: new THREE.Color(0xFF7A00) },
    colorB: { value: new THREE.Color(0xF8FAFF) },
  },
  vertexShader: `
    // Your custom vertex shader
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    // Your custom fragment shader
    uniform vec3 colorA;
    uniform vec3 colorB;
    varying vec3 vPosition;
    
    void main() {
      vec3 color = mix(colorA, colorB, vPosition.y);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});
```

### Post-Processing Effects

```bash
npm install postprocessing
```

```javascript
import { EffectComposer, RenderPass, BloomEffect } from 'postprocessing';

// In SceneManager.js
const composer = new EffectComposer(this.renderer);
composer.addPass(new RenderPass(this.scene, this.camera));
composer.addPass(new BloomEffect());

// In render loop
composer.render(deltaTime);
```

---

Need help with customization? Open an issue or contact support!

