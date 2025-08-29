import { Db, MongoClient } from "mongodb";

import { ENVSchema } from "./load-env";
import { sleep } from "./utils";

declare global {
  var mongoDBPromise: Promise<{ client: MongoClient; db: Db }> | undefined;
}

const uri = ENVSchema.MONGODB_URI;
const dbName = ENVSchema.MONGODB_NAME;

if (!uri) throw new Error("Please define the MONGODB_URI environment variable");

if (!dbName) throw new Error("Please define the MONGODB_DB environment variable");

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function createConnection() {
  console.log("Attempting to connect to MongoDB...");

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const client = await MongoClient.connect(uri!, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
      const db = client.db(dbName);

      await db.command({ ping: 1 });
      console.log(`Successfully connected to MongoDB (attempt ${attempt})`);
      return { client, db };
    } catch (e) {
      lastError = e;
      console.log(
        `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`,
        e instanceof Error ? e.message : String(e),
      );

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  console.log("Failed to connect to MongoDB after multiple attempts");
  throw {
    code: "MONGODB_CONNECTION_FAILED",
    message: "Unable to connect to the database. Please try again later.",
    originalError: lastError,
  };
}

async function connectToDatabase() {
  if (!global.mongoDBPromise) {
    global.mongoDBPromise = createConnection();
    console.log("Created new connection promise");
  }

  try {
    const conn = await global.mongoDBPromise;
    await conn.db.command({ ping: 1 });

    return conn;
  } catch {
    console.log("Connection is no longer valid, creating a new one");
    global.mongoDBPromise = createConnection();
    return global.mongoDBPromise;
  }
}

export default connectToDatabase;
