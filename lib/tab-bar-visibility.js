const TAB_BAR_VISIBLE_PATHS = new Set([
  "/",
  "/home",
  "/catalog",
  "/cart",
  "/favorite",
  "/favorites",
  "/profile",
]);

function normalizePath(path) {
  if (typeof path !== "string" || path.length === 0) return "/";
  const normalized = path.replace(/\/+$/, "");
  return normalized || "/";
}

export function shouldShowTabBarForPath(path) {
  return TAB_BAR_VISIBLE_PATHS.has(normalizePath(path));
}
