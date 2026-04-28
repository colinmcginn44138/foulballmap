# FoulBallMap.com

Interactive heat maps showing your odds of catching a foul ball at every section of MLB stadiums. Powered by Statcast trajectory modeling.

## Quick start (local development)

```bash
npm install
npm run dev
```

Open http://localhost:5173 to view in browser.

## Deploy to Vercel (recommended — free tier)

### Option 1: One-click deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel will detect Vite automatically and deploy in ~30 seconds.

### Option 2: Deploy via GitHub + Vercel

1. Push this folder to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/foulballmap.git
   git push -u origin main
   ```

2. Go to https://vercel.com → "Add New Project" → import the GitHub repo
3. Vercel auto-detects Vite. Click Deploy.

## Connect your custom domain (foulballmap.com)

1. In Vercel: Project Settings → Domains → Add → `foulballmap.com` and `www.foulballmap.com`
2. Vercel will give you DNS records to add at GoDaddy.
3. In GoDaddy: My Domains → foulballmap.com → DNS → add the records Vercel showed you (typically an A record and a CNAME).
4. Wait 5-30 minutes for DNS propagation. Done.

## What's in here

- `src/App.jsx` — the landing page, hero, methodology, email capture
- `src/HeatMap.jsx` — the interactive heat map for Citizens Bank Park
- `src/index.css` — global styles
- `index.html` — meta tags for SEO and social sharing

## Next steps to add more stadiums

Each new stadium needs:
1. Run the Blender script on its `.glb` file from MLB's CDN
2. Run the trajectory engine with that team's Statcast data
3. Add the resulting section data to `HeatMap.jsx` (or split into separate files per stadium)
4. Update the `App.jsx` stadium picker to enable the new stadium
