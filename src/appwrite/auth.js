import { account, ID, OAuthProvider } from "./config";

export const authService = {
  register: (email, password, name) =>
    account.create(ID.unique(), email, password, name),

  login: (email, password) =>
    account.createEmailPasswordSession(email, password),
  loginWithGoogle: () =>
    account.createOAuth2Token(
      OAuthProvider.Google,
      `${window.location.origin}/auth/callback`,
      `${window.location.origin}/auth/failure`
    ),

  logout: () => account.deleteSession("current"),

  getUser: () => account.get(),
};
