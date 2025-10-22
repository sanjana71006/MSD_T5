# Vercel Deployment Guide for Books API

## Files Pushed to GitHub:
✅ server.js - Main Express server
✅ books.json - Initial data file
✅ package.json - Dependencies and scripts
✅ package-lock.json - Lock file
✅ vercel.json - Vercel configuration
✅ .gitignore - Git ignore rules
✅ README.md - Documentation

## How to Deploy on Vercel:

### Step 1: Go to Vercel
1. Visit https://vercel.com
2. Sign in with your GitHub account

### Step 2: Import Your Repository
1. Click "Add New" → "Project"
2. Import your repository: `sanjana71006/MSD_T5`
3. Vercel will automatically detect it's a Node.js project

### Step 3: Configure Project (Usually Auto-detected)
- **Framework Preset**: Other
- **Root Directory**: ./
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)
- **Install Command**: npm install

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete (1-2 minutes)
3. You'll get a URL like: `https://msd-t5.vercel.app` or similar

### Step 5: Test Your API
Once deployed, test your endpoints:
- GET https://your-app.vercel.app/books
- GET https://your-app.vercel.app/books/available
- POST https://your-app.vercel.app/books
- PUT https://your-app.vercel.app/books/:id
- DELETE https://your-app.vercel.app/books/:id

## ⚠️ Important Note about Vercel:
Vercel uses **serverless functions**, which means:
- File writes (to books.json) will NOT persist between requests
- For production, you should use a database (MongoDB, PostgreSQL, etc.)
- The current file-based approach works for development/testing only

## Alternative: If you need persistent storage on Vercel:
You would need to:
1. Use a database like MongoDB Atlas (free tier available)
2. Or use Vercel KV (key-value storage)
3. Or deploy to a platform that supports persistent file storage (like Railway, Render, or Heroku)

## Testing Locally Before Deploy:
```bash
npm install
npm start
# Visit http://localhost:3000/books
```

Your code is now live at: https://github.com/sanjana71006/MSD_T5
