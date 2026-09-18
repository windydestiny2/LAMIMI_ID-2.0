const KEY = "lamimi-wishlist";

export function getWishlist(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function isWishlisted(id: string): boolean {
  return getWishlist().includes(id);
}

export function toggleWishlist(id: string): boolean {
  const current = getWishlist();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("lamimi-wishlist-change"));
  return next.includes(id);
}
