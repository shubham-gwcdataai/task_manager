import { account, ID, OAuthProvider } from "./config";
const SUCCESS_URL = `${window.location.origin}/auth/callback`;
const FAILURE_URL = `${window.location.origin}/auth/failure`;

export const authService = {
  register: (email, password, name) =>
    account.create(ID.unique(), email, password, name),

  login: (email, password) =>
    account.createEmailPasswordSession(email, password),

  // ── OAuth Providers ─────────────────────────────────────────
  loginWithGoogle: () =>
    account.createOAuth2Token(OAuthProvider.Google, SUCCESS_URL, FAILURE_URL),

  loginWithGithub: () =>
    account.createOAuth2Token(OAuthProvider.Github, SUCCESS_URL, FAILURE_URL),

  loginWithFacebook: () =>
    account.createOAuth2Token(OAuthProvider.Facebook, SUCCESS_URL, FAILURE_URL),

  loginWithLinkedin: () =>
    account.createOAuth2Token(OAuthProvider.Linkedin, SUCCESS_URL, FAILURE_URL),

  loginWithMicrosoft: () =>
    account.createOAuth2Token(OAuthProvider.Microsoft, SUCCESS_URL, FAILURE_URL),

  logout: () => account.deleteSession("current"),
  getUser: () => account.get(),
};