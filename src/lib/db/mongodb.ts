import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

const isValidUri = uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");

if (!isValidUri) {
  // During build time with placeholder values — defer the error to runtime
  clientPromise = Promise.reject(
    new Error("MONGODB_URI is not configured. Add it to .env.local")
  );
} else if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
