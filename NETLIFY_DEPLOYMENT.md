# 🚀 Netlify Deployment Guide

## Your Deployment URL

**Frontend**: https://capable-salamander-c75e58.netlify.app

## Quick Deployment

### Option 1: Automatic Deployment (Recommended)

```bash
# Build and deploy in one command
npm run deploy:netlify
```

### Option 2: Manual Build + Deploy

```bash
# Build the project
npm run build

# Deploy with Netlify CLI (if installed)
netlify deploy --prod --dir=dist

# Or drag the 'dist' folder to Netlify dashboard
```

## Environment Variables Setup

### 1. Local Development (.env)

```env
REACT_APP_API_URL=http://localhost:3002
REACT_APP_FRONTEND_URL=https://capable-salamander-c75e58.netlify.app
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
```

### 2. Production (.env.production)

```env
REACT_APP_API_URL=https://your-backend-api.herokuapp.com
REACT_APP_FRONTEND_URL=https://capable-salamander-c75e58.netlify.app
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
```

### 3. Netlify Dashboard Environment Variables

Go to: **Site Settings > Environment Variables**

Add these variables:

- `REACT_APP_API_URL` = Your backend API URL
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` = Your Stripe publishable key
- `REACT_APP_FIREBASE_PROJECT_ID` = Your Firebase project ID
- (Add all other REACT*APP* variables)

## Backend Configuration

### Update CORS for Netlify

Your backend needs to allow requests from Netlify:

```javascript
// In your backend index.js
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://capable-salamander-c75e58.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
```

## Deployment Checklist

### ✅ Frontend (Netlify)

- [ ] Build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled (automatic)
- [ ] Redirects configured for SPA

### ⚠️ Backend (Needs Deployment)

- [ ] Deploy backend to Heroku/Railway/Vercel
- [ ] Update CORS to allow Netlify domain
- [ ] Set production environment variables
- [ ] Update API URL in frontend

### 🔧 Stripe Configuration

- [ ] Test keys for development
- [ ] Live keys for production
- [ ] Webhook endpoints configured
- [ ] Domain verification completed

## Deployment Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Netlify
npm run deploy:netlify

# Deploy to Firebase (alternative)
npm run deploy
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Loading

1. Check variable names start with `REACT_APP_`
2. Restart development server after changes
3. Verify in Netlify dashboard settings

### CORS Errors

1. Update backend CORS configuration
2. Add Netlify domain to allowed origins
3. Check backend is deployed and accessible

### API Calls Failing

1. Verify backend is deployed and running
2. Check API URL in environment variables
3. Test API endpoints directly

## Custom Domain Setup (Optional)

### 1. In Netlify Dashboard

- Go to **Domain Settings**
- Click **Add custom domain**
- Enter your domain name

### 2. DNS Configuration

Point your domain to Netlify:

```
CNAME: your-domain.com -> capable-salamander-c75e58.netlify.app
```

### 3. SSL Certificate

Netlify automatically provides SSL certificates for custom domains.

## Performance Optimization

### 1. Build Optimization

- Code splitting enabled by default
- Tree shaking for unused code
- Asset optimization

### 2. Caching Headers

Configured in `netlify.toml`:

- Static assets: 1 year cache
- HTML: No cache (for updates)

### 3. Compression

- Gzip compression enabled
- Brotli compression available

## Monitoring & Analytics

### 1. Netlify Analytics

Enable in dashboard for:

- Page views
- Unique visitors
- Top pages
- Referrers

### 2. Error Tracking

Consider adding:

- Sentry for error tracking
- Google Analytics for user behavior
- LogRocket for session replay

## Continuous Deployment

### GitHub Integration

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Enable auto-deploy on push

### Build Hooks

Create webhook URLs for:

- Manual deployments
- External service triggers
- Scheduled rebuilds

---

## 🎯 Current Status

✅ **Configured**:

- Netlify deployment setup
- Environment variables template
- Build configuration
- CORS configuration
- Deployment scripts

⚠️ **Next Steps**:

1. Deploy your backend to a cloud service
2. Update API URLs in environment variables
3. Configure Stripe with live keys for production
4. Test the complete payment flow

**Your frontend is ready for deployment!** 🎉

Deploy with: `npm run deploy:netlify`
