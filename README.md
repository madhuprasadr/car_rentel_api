# Car Rental API

## MongoDB Atlas Setup for Vercel Deployment

Follow these steps to create a new MongoDB Atlas cluster for your Vercel deployment:

1. **Create a MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a Free Cluster**:
   - Select "Shared" (Free) tier
   - Choose any cloud provider and region (preferably close to your users)
   - Click "Create Cluster"

3. **Set Up Database Access**:
   - In the security section, create a new database user
   - Username: Choose a username
   - Password: Generate a secure password
   - Set user privileges to "Read and Write to any database"

4. **Set Network Access**:
   - In the Network Access section, click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - This is required for Vercel deployment

5. **Get Connection String**:
   - Once the cluster is created, click "Connect"
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `<dbname>` with "car_rental"

6. **Update Environment Variables**:
   - In your local `.env` file, update the `MONGO_URL` with the new connection string
   - In Vercel, add the same environment variable during deployment

## Local Development
```
# Start MongoDB locally
brew services start mongodb-community

# Run the application
npm run dev
```

## Deploying to Vercel
```
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Make sure to set the environment variables in Vercel: 