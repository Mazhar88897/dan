/** Base URL for backend API (same as sign-in). */
export function getAuthApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "") || "http://localhost:3000";
}

export const SIGNUP_TOKEN_KEY = "auth_signup_token";
export const SIGNUP_EMAIL_KEY = "auth_signup_email";
export const RESET_TOKEN_KEY = "auth_reset_token";
export const RESET_EMAIL_KEY = "auth_reset_email";
