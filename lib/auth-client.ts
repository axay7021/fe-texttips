import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  plugins: [],
  baseURL: "http://localhost:3000",
});

export const { signIn, signUp, useSession } = authClient;
