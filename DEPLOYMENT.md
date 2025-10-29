# 🚀 Netlify Deployment Guide

This guide will help you deploy your Lukeforge website to Netlify.

## 📋 Prerequisites

- [Netlify account](https://netlify.com) (free tier available)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally

## 🛠️ Deployment Methods

### Method 1: Git-based Deployment (Recommended)

1. **Push your code to Git repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18` (or leave default)

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Method 2: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder to the deploy area
   - Your site will be live immediately

### Method 3: Netlify CLI (Advanced)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   # Deploy preview
   npm run deploy-preview
   
   # Deploy to production
   npm run deploy
   ```

## ⚙️ Configuration Files

The project includes these Netlify configuration files:

- **`netlify.toml`**: Main configuration with build settings, redirects, and headers
- **`public/_redirects`**: SPA routing fallback
- **`.nvmrc`**: Node.js version specification

## 🔧 Build Optimization

The build process is optimized for production:

- **Code splitting**: Automatic chunk splitting for better performance
- **Minification**: JavaScript and CSS are minified
- **Tree shaking**: Unused code is removed
- **Asset optimization**: Images and fonts are optimized
- **Gzip compression**: Enabled for better loading times

## 📊 Performance Features

- **Lazy loading**: Three.js components load only when needed
- **Responsive images**: Optimized for different screen sizes
- **Caching**: Static assets cached for 1 year
- **Security headers**: XSS protection, content type validation
- **SPA routing**: Proper redirects for single-page application

## 🌐 Custom Domain (Optional)

1. **Add custom domain in Netlify dashboard**
2. **Update DNS settings** with your domain provider
3. **Enable HTTPS** (automatic with Netlify)

## 🔍 Monitoring & Analytics

- **Netlify Analytics**: Available in dashboard
- **Build logs**: View in Netlify dashboard
- **Performance monitoring**: Built-in Core Web Vitals tracking

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check build logs in Netlify dashboard

### 404 Errors on Refresh
- Ensure `_redirects` file is in `public/` folder
- Check `netlify.toml` redirect rules

### Performance Issues
- Enable Netlify's CDN
- Check image optimization
- Review bundle size in build logs

## 📝 Environment Variables

If you need environment variables:

1. **In Netlify dashboard**: Site settings → Environment variables
2. **In code**: Use `import.meta.env.VITE_VARIABLE_NAME`

## 🔄 Continuous Deployment

Once connected to Git:
- **Automatic deploys** on every push to main branch
- **Preview deploys** for pull requests
- **Rollback** to previous deployments if needed

## 📞 Support

- [Netlify Documentation](https://docs.netlify.com)
- [Vite Documentation](https://vitejs.dev)
- [Three.js Documentation](https://threejs.org)

---

**Your Lukeforge website is now ready for deployment! 🎉**