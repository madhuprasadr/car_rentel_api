# Deploying to Vercel

Follow these steps to deploy your Car Rental API to Vercel:

## 1. Set up MongoDB Atlas (Free Tier)

1. Create a new MongoDB Atlas account at https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster (M0 Free Tier)
3. Set up database access (create username and password)
4. Set network access to allow connections from anywhere (0.0.0.0/0)
5. Get your MongoDB connection string

## 2. Deploy to Vercel

### Using Vercel CLI

```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel
```

### Using Vercel Dashboard

1. Go to https://vercel.com
2. Create an account or sign in
3. Click "New Project"
4. Import your Git repository
5. Configure project:
   - Framework preset: Other
   - Build command: None
   - Output directory: None
   - Install command: npm install

## 3. Set Environment Variables

In the Vercel dashboard, set these environment variables for your project:

- `MONGO_URL`: Your MongoDB Atlas connection string
- `PORT`: 3000 (Vercel ignores this and uses its own port)
- `SECRET`: Your JWT secret key
- `NODE_ENV`: production

## 4. Verify Deployment

After deployment, test your API endpoints using Postman or any API testing tool.

## Troubleshooting

If you encounter MongoDB connection issues:

1. Check that your MongoDB Atlas IP whitelist includes 0.0.0.0/0
2. Verify your connection string format
3. Make sure your MongoDB Atlas user has the correct permissions

## Local Testing Before Deployment

```bash
# Set NODE_ENV to production locally
export NODE_ENV=production

# Use your MongoDB Atlas connection in .env file
# Start the application
npm start
``` 