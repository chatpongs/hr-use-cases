import type { Route } from "./+types/login";
import { redirect } from "react-router";
import { isAuthenticated, getAuthCookieHeader } from "../lib/auth.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login — Talent Intelligence Demo" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  if (isAuthenticated(request)) {
    throw redirect("/");
  }
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");
  const expectedPassword = process.env.DEMO_PASSWORD || "demo";

  if (password === expectedPassword) {
    return redirect("/", {
      headers: { "Set-Cookie": getAuthCookieHeader() },
    });
  }

  return { error: "Incorrect password. Please try again." };
}

export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <div className="mb-2">
            <h1 className="text-xl font-bold text-base-content">
              Talent Intelligence
            </h1>
            <p className="text-sm text-base-content/60">
              Phase 1 Demo
            </p>
          </div>

          <form method="post" className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-base-content/70">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter demo password"
                required
                autoFocus
                className="input input-bordered w-full"
              />
            </div>

            {actionData?.error && (
              <div className="alert alert-error py-2">
                <span className="text-sm">{actionData.error}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full">
              Enter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
