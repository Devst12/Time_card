import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_Client_ID,
      clientSecret: process.env.GOOGLE_Client_secret,
    }),
    FacebookProvider({
      clientId: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
