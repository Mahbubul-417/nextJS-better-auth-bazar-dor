// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL: "http://localhost:3000",
// });

// export const { signIn, signUp, useSession } = authClient;

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  updateUser,
} = authClient;