const mongoose = require('mongoose');
const { ServerApiVersion } = require('mongodb');

const DB = process.env.MONGO_URL;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

// For Vercel deployment
const connectDB = async () => {
  try {
    await mongoose.connect(DB, options);
    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // In production, we want to retry rather than exit
    if (process.env.NODE_ENV === 'production') {
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

connectDB();
