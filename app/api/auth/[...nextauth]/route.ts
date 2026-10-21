import { APP_ENV } from "@/app/env";
import { AppDB } from "@/libs/db";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";





const handler = NextAuth({
    providers: [
        Google({
            clientId: APP_ENV.GOOGLE_CLIENT_ID,
            clientSecret: APP_ENV.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        signIn: async (data) => {
            const email = data.profile?.email;
            return email ? await AppDB.user.email.login(email).catch(() => false) : false
        }
    }
})

export { handler as GET, handler as POST };