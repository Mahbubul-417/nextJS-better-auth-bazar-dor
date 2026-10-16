import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL!);
const db = client.db("Bazar-dor");

export const auth = betterAuth({
  
  baseURL: process.env.BETTER_AUTH_URL ,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,

  },

  trustedOrigins: ["http://localhost:3000"],
});