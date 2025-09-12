import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";

const adminEmails = [
  "abhi120730@gmail.com",
  "mihirgomugomu911@gmail.com",
  "kunalverma8055@gmail.com",
  "mayank@gomugomu.in",
  "varsanismit@gmail.com",
  "harsh.nextgenadvisory@gmail.com",
];

const client = new MongoClient(process.env.MONGODB_URI);
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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = adminEmails.includes(user.email);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.isAdmin = token.isAdmin;

      session.backendToken = jwt.sign(
        { id: token.id, email: token.email, isAdmin: token.isAdmin },
        process.env.BACKEND_JWT_SECRET,
        { expiresIn: "7d" }
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("adminToken", session.backendToken);
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
