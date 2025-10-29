# Quick Start Guide

Get the Lukeforge website running in under 5 minutes!

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Installation

```bash
# 1. Navigate to the project directory
cd lukeforge

# 2. Install dependencies (takes ~1-2 minutes)
npm install

# 3. Start development server
npm run dev
```

Your site will open automatically at **http://localhost:3000** 🎉

## Optional: Start Mock API Server

In a **new terminal window**:

```bash
npm run serve:mock
```

This starts a mock API server at **http://localhost:3001** for testing the contact form.

## Next Steps

### 🎨 Customize Your Site

1. **Colors**: Edit `src/styles/main.css` (CSS variables at top)
2. **Logo**: Replace `public/logo.svg`
3. **Content**: Update text in `src/index.html`
4. **Services**: Edit `src/sections/Services.js`
5. **Portfolio**: Edit `src/sections/Portfolio.js`

See [CUSTOMIZATION.md](CUSTOMIZATION.md) for detailed instructions.

### 🚀 Deploy Your Site

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Then deploy to:
- **Vercel** (recommended): `npm i -g vercel && vercel`
- **Netlify**: Drag `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages**: See [DEPLOYMENT.md](DEPLOYMENT.md)

### ✅ Verify Everything Works

- [ ] Hero section loads with 3D text
- [ ] Particles are visible and animating
- [ ] Navigation menu works (try mobile too)
- [ ] All sections scroll smoothly
- [ ] Contact form validates input
- [ ] Portfolio modal opens when clicking projects
- [ ] Theme toggle switches between dark/light
- [ ] No errors in browser console (F12)

## Common Issues

### Port 3000 already in use

```bash
# Kill process on port 3000 (Windows PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# Or use a different port
npm run dev -- --port 3001
```

### 3D scene not rendering

- **Check browser console** for errors (F12)
- **Try different browser** (Chrome recommended)
- **Disable browser extensions** that might block WebGL
- **Update graphics drivers** if using older hardware

### Dependencies fail to install

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run format       # Format code with Prettier
npm run serve:mock   # Start mock API server
npm run test:build   # Smoke test build
```

## File Structure Overview

```
lukeforge/
├── src/
│   ├── index.html          # Main HTML
│   ├── main.js             # App entry point
│   ├── styles/main.css     # All styles
│   ├── components/         # Three.js components
│   └── sections/           # Page sections
├── public/                 # Static assets
├── server/                 # Mock API server
└── dist/                   # Production build (after npm run build)
```

## Learning Resources

- **Three.js**: [threejs.org/docs](https://threejs.org/docs/)
- **Vite**: [vitejs.dev/guide](https://vitejs.dev/guide/)
- **Full Docs**: See [README.md](README.md)

## Getting Help

- 📖 Check [README.md](README.md) for detailed docs
- 🐛 Found a bug? Open an issue on GitHub
- 💬 Questions? Contact hello@lukeforge.com

---

**Happy coding!** 🚀 Built with ❤️ by Lukeforge

