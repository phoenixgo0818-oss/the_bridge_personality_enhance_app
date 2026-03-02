/**
 * API client for The Bridge backend.
 *
 * Vite dev server proxies /api/* to http://localhost:8000, so we use BASE='/api'
 * to avoid CORS. In production, you'd set BASE to your backend URL.
 */
const BASE = '/api';

/**
 * Generic fetch wrapper: JSON body, JSON response, throws on non-2xx.
 * Type param T lets callers get typed responses: request<Profile>('/profile')
 */
async function request<T>(
  path: string,
  options?: Omit<RequestInit, 'body'> & { body?: object }
): Promise<T> {
  const { body, ...rest } = options ?? {};
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...rest.headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    // FastAPI returns { detail: "..." } on errors
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error((err as { detail?: string }).detail ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;  // No content
  return res.json();
}

// Shared types for API responses
export type Profile = { current_self: string; future_self: string };
export type Brick = { id: number; date: string; brick_text: string; laid: boolean };
export type Streak = { streak_days: number };

export const api = {
  getProfile: () => request<Profile>('/profile'),
  updateProfile: (current_self: string, future_self: string) =>
    request<Profile>('/profile', { method: 'PUT', body: { current_self, future_self } }),

  getTodayBrick: () => request<Brick | null>('/bricks/today'),
  createTodayBrick: (brick_text: string) =>
    request<Brick>('/bricks/today', { method: 'POST', body: { brick_text } }),
  markTodayLaid: () => request<{ ok: boolean }>('/bricks/today/laid', { method: 'PATCH' }),

  getStreak: () => request<Streak>('/bricks/streak'),
  listBricks: (limit = 30) => request<Brick[]>(`/bricks?limit=${limit}`),
}
