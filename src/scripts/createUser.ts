import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = "mongodb+srv://doggo:JMRbdOEFzEPumWbL@doggo.eebijgu.mongodb.net/";

async function main() {
  const email = process.argv[2];
  const name = process.argv[3] || "User";
  const password = process.argv[4];
  const image = process.argv[5] || "";
  if (!email || !password) {
    console.error("Usage: ts-node createUser.ts <email> <name> <password> [imageUrl]");
    process.exit(1);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const users = db.collection("users");
  const existing = await users.findOne({ email });
  if (existing) {
    console.error("User already exists");
    process.exit(1);
  }
  await users.insertOne({ email, name, hashedPassword, image });
  console.log("User created:", email);
  await client.close();
}

main(); 