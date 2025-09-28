# Deployment Guide

This guide will help you deploy the Live Polling System to production.

## Prerequisites

- Heroku account (for backend)
- Netlify account (for frontend)
- Git repository

## Backend Deployment (Heroku)

### 1. Prepare Backend for Heroku

The backend is already configured with:
- `Procfile` for Heroku
- `package.json` with start script
- Environment variable support

### 2. Deploy to Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-polling-backend

# Navigate to backend directory
cd backend

# Initialize git if not already done
git init
git add .
git commit -m "Initial backend commit"

# Add Heroku remote
heroku git:remote -a your-polling-backend

# Deploy
git push heroku main

# Open the app
heroku open
```

### 3. Get Backend URL

After deployment, note your backend URL (e.g., `https://your-polling-backend.herokuapp.com`)

## Frontend Deployment (Netlify)

### 1. Prepare Frontend for Production

Update the frontend to use the production backend URL:

```bash
cd frontend
```

Create `.env.production` file:
```
REACT_APP_SERVER_URL=https://your-polling-backend.herokuapp.com
```

### 2. Build the Frontend

```bash
npm run build
```

### 3. Deploy to Netlify

#### Option A: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build
```

#### Option B: Netlify Web Interface
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `build`
6. Add environment variable: `REACT_APP_SERVER_URL=https://your-polling-backend.herokuapp.com`
7. Deploy

## Alternative Deployment Options

### Backend Alternatives
- **Railway**: Easy deployment with automatic HTTPS
- **Render**: Free tier available
- **DigitalOcean App Platform**: More control and customization

### Frontend Alternatives
- **Vercel**: Excellent for React apps
- **GitHub Pages**: Free static hosting
- **Firebase Hosting**: Google's hosting solution

## Environment Variables

### Backend
- `PORT`: Port number (Heroku sets this automatically)
- `NODE_ENV`: Set to 'production' in production

### Frontend
- `REACT_APP_SERVER_URL`: Backend URL for API calls

## Custom Domain (Optional)

### Backend (Heroku)
1. Go to your Heroku app settings
2. Add your custom domain
3. Configure DNS records

### Frontend (Netlify)
1. Go to your Netlify site settings
2. Add custom domain
3. Configure DNS records

## Monitoring and Maintenance

### Backend Monitoring
- Use Heroku logs: `heroku logs --tail`
- Monitor performance in Heroku dashboard
- Set up uptime monitoring

### Frontend Monitoring
- Use Netlify analytics
- Monitor build status
- Set up error tracking (Sentry, etc.)

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for frontend domain
   - Check environment variables

2. **Socket.io Connection Issues**
   - Verify backend URL is correct
   - Check if backend is running
   - Ensure WebSocket support

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

### Getting Help

- Check the application logs
- Verify all environment variables are set
- Test locally first
- Check network connectivity

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to git
   - Use environment variables for all secrets

2. **CORS Configuration**
   - Only allow your frontend domain
   - Remove wildcard CORS in production

3. **Rate Limiting**
   - Consider adding rate limiting to prevent abuse
   - Monitor for unusual activity

## Performance Optimization

1. **Frontend**
   - Enable gzip compression
   - Use CDN for static assets
   - Optimize images

2. **Backend**
   - Enable compression
   - Use connection pooling
   - Monitor memory usage

## Backup Strategy

1. **Code**
   - Use Git for version control
   - Regular commits and pushes

2. **Data**
   - Current implementation uses in-memory storage
   - Consider adding database for production use

## Scaling Considerations

For high-traffic scenarios:
1. Add database (MongoDB, PostgreSQL)
2. Use Redis for session management
3. Implement horizontal scaling
4. Add load balancing
5. Use CDN for static assets
