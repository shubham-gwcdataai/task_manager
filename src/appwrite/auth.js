import { account, ID, OAuthProvider } from "./config";

export const authService = {
  register: (email, password, name) =>
    account.create(ID.unique(), email, password, name),

  login: (email, password) =>
    account.createEmailPasswordSession(email, password),

  // ── OAuth providers ─────────────────────────────────────
  loginWithGoogle: () =>
    account.createOAuth2Token(
      OAuthProvider.Google,
      `${window.location.origin}/auth/callback`,
      `${window.location.origin}/auth/failure`
    ),

  loginWithFacebook: () =>
    account.createOAuth2Token(
      OAuthProvider.Facebook,
      `${window.location.origin}/auth/callback`,
      `${window.location.origin}/auth/failure`
    ),

  loginWithGithub: () =>
    account.createOAuth2Token(
      OAuthProvider.Github,
      `${window.location.origin}/auth/callback`,
      `${window.location.origin}/auth/failure`
    ),

  loginWithLinkedin: () =>
    account.createOAuth2Token(
      OAuthProvider.Linkedin,
      `${window.location.origin}/auth/callback`,
      `${window.location.origin}/auth/failure`
    ),

  loginWithMicrosoft: () =>
    account.createOAuth2Token(
      OAuthProvider.Microsoft,
      `${window.location.origin}/auth/callback`,
      `${window.location.origin}/auth/failure`
    ),

  logout: () => account.deleteSession("current"),
  getUser: () => account.get(),
};
