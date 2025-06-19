import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('Please add your MONGO_URI to your environment variables');
}

class MongoDB {
  private static instance: MongoDB;
  private client: MongoClient;
  private clientPromise: Promise<MongoClient>;

  private constructor() {
    this.client = new MongoClient(uri as string);
    this.clientPromise = this.client.connect();
  }

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  public async getClient(): Promise<MongoClient> {
    return this.clientPromise;
  }
}

export default MongoDB;