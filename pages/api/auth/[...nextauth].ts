import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; // Korrekter Import
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User";

const connectToDatabase = async () => {
  if (mongoose.connection.readyState < 1) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in the .env file.");
    }
    return mongoose.connect(process.env.MONGODB_URI);
  }
  return mongoose;
};

export default NextAuth({
  session: {
    strategy: "jwt", // Aktualisiert für NextAuth v4
    maxAge: 180 * 24 * 60 * 60, // 180 Tage
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await connectToDatabase();

        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const user = await User.findOne({
          email: credentials.email,
        });

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return { id: user.id, email: user.email };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/register", // Pfad zur Registrierungsseite, wenn vorhanden
  },
});
