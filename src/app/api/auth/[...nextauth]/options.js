import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

// create options for nextAuth social logins
export const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET
}
