# Deployment Guide for Lukeforge

This guide provides step-by-step instructions for deploying the Lukeforge website to various hosting platforms.

## Pre-Deployment Checklist

Before deploying, ensure you've completed these steps:

- [ ] Replace placeholder images (favicon.ico, og-image.png) with actual images
- [ ] Update all content with real company information
- [ ] Test the build locally: `npm run build && npm run preview`
- [ ] Run Lighthouse audit and achieve target scores (Performance 80+, Accessibility 90+)
- [ ] Replace mock API endpoint with real backend API
- [ ] Update meta tags in `index.html` with accurate SEO information
- [ ] Configure analytics (Google Analytics, Plausible, etc.)
- [ ] Set up error tracking (Sentry, LogRocket, etc.)

## Vercel Deployment (Recommended)

### Why Vercel?

- Zero configuration for Vite
- Automatic HTTPS
- Global CDN
- Automatic deployments from Git
- Excellent performance
- Free tier for personal projects

### Deploy with Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Navigate to project directory
cd lukeforge

# 4. Deploy (first time - creates project)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? lukeforge (or your preferred name)
# - In which directory? ./ (root)
# - Override settings? No

# 5. Deploy to production
vercel --prod
```

### Deploy with Vercel Git Integration

1. **Push to Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/lukeforge.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Vercel auto-detects Vite configuration
   - Click "Deploy"

3. **Configure Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed
   - SSL is automatic

### Environment Variables (if using real API)

```bash
# Add via CLI
vercel env add VITE_API_URL

# Or in dashboard:
# Project Settings → Environment Variables
# Add: VITE_API_URL = https://api.yoursite.com
```

## Netlify Deployment

### Deploy with Netlify CLI

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Initialize site
netlify init

# Follow prompts:
# - Create & configure a new site
# - Team: Select your team
# - Site name: lukeforge (or preferred)
# - Build command: npm run build
# - Publish directory: dist

# 4. Deploy
netlify deploy --prod
```

### Deploy with Netlify Git Integration

1. **Push to Git** (if not already done)

2. **Import to Netlify**:
   - Go to [app.netlify.com/start](https://app.netlify.com/start)
   - Click "Import from Git"
   - Select your Git provider and repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Node version**: 18 (add in Environment Variables: `NODE_VERSION=18`)
   - Click "Deploy site"

3. **Configure Custom Domain**:
   - Site Settings → Domain management
   - Add custom domain
   - Configure DNS
   - SSL is automatic

### netlify.toml Configuration (Optional)

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## GitHub Pages

### Configuration

1. **Update vite.config.js**:
   ```javascript
   export default defineConfig({
     base: '/lukeforge/', // Your repo name
     // ... rest of config
   });
   ```

2. **Add deployment script to package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

### Deploy

```bash
# Deploy to gh-pages branch
npm run deploy

# Your site will be available at:
# https://yourusername.github.io/lukeforge/
```

### Configure GitHub Repository

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Save

## AWS S3 + CloudFront

### Prerequisites

- AWS account
- AWS CLI installed and configured

### Deploy to S3

```bash
# 1. Build the project
npm run build

# 2. Create S3 bucket (one time)
aws s3 mb s3://lukeforge-website

# 3. Configure bucket for static hosting
aws s3 website s3://lukeforge-website \
  --index-document index.html \
  --error-document index.html

# 4. Upload build
aws s3 sync dist/ s3://lukeforge-website \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.json"

# 5. Upload HTML with shorter cache
aws s3 sync dist/ s3://lukeforge-website \
  --delete \
  --cache-control "public, max-age=0, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "*.json"

# 6. Make bucket public
aws s3api put-bucket-policy \
  --bucket lukeforge-website \
  --policy file://bucket-policy.json
```

**bucket-policy.json**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::lukeforge-website/*"
    }
  ]
}
```

### Add CloudFront CDN

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name lukeforge-website.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html

# Note the distribution domain name for your site
```

## Firebase Hosting

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize Firebase
firebase init hosting

# Select:
# - Public directory: dist
# - Configure as SPA: Yes
# - Set up automatic builds: No

# 4. Build and deploy
npm run build
firebase deploy --only hosting
```

## Cloudflare Pages

### Deploy via Dashboard

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → Create a project
3. Connect Git repository
4. Configure build:
   - **Build command**: `npm run build`
   - **Build output**: `dist`
   - **Environment variables**: `NODE_VERSION=18`
5. Deploy

### Deploy via Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Build
npm run build

# Deploy
wrangler pages publish dist --project-name=lukeforge
```

## Custom Server / VPS

If deploying to your own server (DigitalOcean, Linode, etc.):

### Using Nginx

```bash
# 1. Build locally
npm run build

# 2. Upload dist/ to server
scp -r dist/* user@yourserver:/var/www/lukeforge

# 3. Configure Nginx
sudo nano /etc/nginx/sites-available/lukeforge
```

**Nginx config**:
```nginx
server {
    listen 80;
    server_name lukeforge.com www.lukeforge.com;
    root /var/www/lukeforge;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

```bash
# 4. Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/lukeforge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 5. Set up SSL with Let's Encrypt
sudo certbot --nginx -d lukeforge.com -d www.lukeforge.com
```

## Post-Deployment

### 1. Verify Deployment

- [ ] Visit your site and check all pages load
- [ ] Test all interactive elements (contact form, modals, navigation)
- [ ] Check mobile responsiveness
- [ ] Verify 3D scene renders properly
- [ ] Test on different browsers
- [ ] Check console for errors

### 2. Performance Testing

```bash
# Run Lighthouse
npx lighthouse https://your-site.com --view

# Or use web-based tool
# https://pagespeed.web.dev/
```

Target scores:
- Performance: 80+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### 3. Set Up Monitoring

- **Analytics**: Google Analytics, Plausible, or Fathom
- **Error Tracking**: Sentry, Rollbar, or LogRocket
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: SpeedCurve, Calibre

### 4. SEO

```bash
# Create sitemap.xml
# Add to public/ directory
```

**sitemap.xml**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lukeforge.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

Submit to:
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### 5. Set Up CI/CD (Optional)

**GitHub Actions** (.github/workflows/deploy.yml):
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run test:build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting Deployment

### Build fails in CI/CD

**Issue**: Works locally but fails in deployment

**Solution**:
```bash
# Check Node version matches
# In CI, set NODE_VERSION environment variable

# Clear cache
rm -rf node_modules .vite
npm install
npm run build
```

### 404 errors on refresh

**Issue**: Direct URLs return 404

**Solution**: Configure server to redirect all routes to index.html (see server configs above)

### Assets not loading

**Issue**: CSS/JS not found

**Solution**: Check `base` in vite.config.js matches your deployment path

### CORS errors with API

**Issue**: Contact form can't reach API

**Solution**: Configure CORS on your backend:
```javascript
// Express example
app.use(cors({
  origin: 'https://your-site.com'
}));
```

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://www.netlify.com/support/)
- Open an issue on GitHub

---

**Last Updated**: October 2025

