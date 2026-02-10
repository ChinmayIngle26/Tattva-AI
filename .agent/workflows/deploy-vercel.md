---
description: How to host the Tattva AI site on Vercel
---

# Deploying to Vercel

Follow these steps to deploy your Next.js application to Vercel.

## Option 1: Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (or GitLab/Bitbucket).
2. **Login to Vercel**: Visit [vercel.com](https://vercel.com) and sign in with your Git provider.
3. **Import Project**: 
   - Click "Add New" > "Project".
   - Select your repository from the list.
4. **Configure Project**:
   - Vercel should automatically detect **Next.js** as the framework.
   - Keep the default build settings (`next build`).
   - Add any **Environment Variables** if your project requires them (e.g., API keys).
5. **Deploy**: Click the "Deploy" button. Your site will be live in a few minutes!

## Option 2: Vercel CLI

If you prefer using the terminal:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```
2. **Login**:
   ```bash
   vercel login
   ```
3. **Deploy**: Run this command in your project root:
   ```bash
   vercel
   ```
4. **Production Deploy**: Once you've verified the preview, deploy to production:
   ```bash
   vercel --prod
   ```

## Post-Deployment
- Configure a custom domain in the Vercel project settings.
- Enable automatic deployments for every push to your main branch.
