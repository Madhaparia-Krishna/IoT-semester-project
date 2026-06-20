# GitHub Pages Deployment Guide

## Automatic Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Steps to Enable GitHub Pages:

1. **Go to your GitHub repository**: 
   - https://github.com/Madhaparia-Krishna/IoT-semester-project

2. **Navigate to Settings**:
   - Click on the "Settings" tab at the top of your repository

3. **Enable GitHub Pages**:
   - Scroll down to the "Pages" section in the left sidebar
   - Under "Build and deployment" → "Source", select **"GitHub Actions"**
   - Click "Save"

4. **Wait for Deployment**:
   - Go to the "Actions" tab to see the deployment progress
   - The workflow will automatically build and deploy your site
   - This usually takes 1-2 minutes

5. **Access Your Site**:
   - Once deployed, your site will be available at:
   - **https://madhaparia-krishna.github.io/IoT-semester-project/**

### How It Works:

- Every time you push to the `main` branch, GitHub Actions automatically:
  1. Installs dependencies
  2. Builds the React application
  3. Deploys to GitHub Pages

### Manual Deployment (Alternative):

If you prefer manual deployment using the command line:

```bash
# Build and deploy manually
npm run deploy
```

This will build the project and push the `dist` folder to the `gh-pages` branch.

## Configuration Files:

- **`.github/workflows/deploy.yml`** - GitHub Actions workflow for automatic deployment
- **`vite.config.ts`** - Contains the base path configuration for GitHub Pages
- **`public/.nojekyll`** - Prevents Jekyll processing on GitHub Pages

## Troubleshooting:

### Site Not Loading?
1. Make sure GitHub Pages is set to "GitHub Actions" source
2. Check the Actions tab for any failed deployments
3. Clear your browser cache and try again

### Images Not Loading?
- The base path is configured as `/IoT-semester-project/`
- All assets are automatically resolved with this base path

### Need to Update?
Just push your changes to the `main` branch:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

The site will automatically redeploy!

## Local Development:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Your Live Site:
🌐 **https://madhaparia-krishna.github.io/IoT-semester-project/**
