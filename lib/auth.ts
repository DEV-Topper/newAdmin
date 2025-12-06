export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ApiResult<T = any> =
  | { success: true; data: T }
  | { success: false; error: string; status?: number; details?: any };

/**
 * Register admin using remote API (via proxy).
 */
export async function registerAdmin(payload: RegisterPayload): Promise<ApiResult> {
  try {
    const res = await fetch("/api/proxy/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const err = (json && (json.message || json.error || json.detail)) || "Registration failed";
      return { success: false, error: err, status: res.status, details: json };
    }

    return { success: true, data: json };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Network error" };
  }
}

/**
 * Login user via proxy route.
 * Returns ApiResult with data from remote API (likely contains token).
 */
export async function loginUser(payload: LoginPayload): Promise<ApiResult> {
  try {
    const res = await fetch("/api/proxy/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const err = (json && (json.message || json.error || json.detail)) || "Login failed";
      return { success: false, error: err, status: res.status, details: json };
    }

    return { success: true, data: json };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Network error" };
  }
}