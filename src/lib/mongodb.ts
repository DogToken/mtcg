import { MongoClient } from "mongodb";

const uri = "mongodb+srv://doggo:JMRbdOEFzEPumWbL@doggo.eebijgu.mongodb.net/";
const options = {};

let client;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise!;

export default clientPromise; 