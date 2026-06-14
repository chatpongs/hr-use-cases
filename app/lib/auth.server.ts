import { createHash } from "node:crypto";
import { redirect } from "react-router";

const COOKIE_NAME = "demo_auth";
const COOKIE_MAX_AGE = 604800;

function getPassword(): string {
  return process.env.DEMO_PASSWORD || "demo";
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  for (const cookie of cookieHeader.split(";")) {
    const [name, ...valueParts] = cookie.trim().split("=");
    if (name) {
      cookies[name.trim()] = valueParts.join("=").trim();
    }
  }
  return cookies;
}

export function isAuthenticated(request: Request): boolean {
  const cookies = parseCookies(request.headers.get("Cookie"));
  return cookies[COOKIE_NAME] === hashPassword(getPassword());
}

export function requireAuth(request: Request): void {
  if (!isAuthenticated(request)) {
    throw redirect("/login");
  }
}

export function getAuthCookieHeader(): string {
  const hashed = hashPassword(getPassword());
  return `${COOKIE_NAME}=${hashed}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`;
}

export function getClearCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}
