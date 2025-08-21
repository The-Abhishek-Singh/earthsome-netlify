import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient } from "mongodb";

const adminEmails = [
  "abhi120730@gmail.com",
  "mihirgomugomu911@gmail.com",
  "kunalverma8055@gmail.com",
  "mayank@gomugomu.in",
];

// MongoDB connection for NextAuth
const MONGODB_URI =
  "mongodb+srv://Abhishek:Abhi1207302518@earthsome.0stadtf.mongodb.net/earthsome";
const client = new MongoClient(MONGODB_URI);
const clientPromise = client.connect();

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/Login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = adminEmails.includes(user.email);
      }
      return token;
    },
    async session({ session, token, user }) {
      // With database strategy, user object is available
      if (user) {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.isAdmin = adminEmails.includes(user.email);
      } else {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Always allow sign in for Google OAuth
      return true;
    },
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
