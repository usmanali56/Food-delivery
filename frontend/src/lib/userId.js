const STORAGE_KEY = "fooddel_user_id";

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `user_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

/**
 * Simple client-side user id so we can fetch "my orders" without full auth.
 */
export function getOrCreateUserId() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const id = randomId();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}
