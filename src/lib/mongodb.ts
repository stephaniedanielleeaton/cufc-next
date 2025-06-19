import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI as string;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGO_URI) {
  throw new Error('Please add your MONGO_URI to your environment variables');
}

// Define types for global with MongoDB client
type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

// Check if in development mode to use cached connection
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR
  const globalWithMongo = global as GlobalWithMongo;
  
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
    console.log('Connected to MongoDB in development mode');
  }
  
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
