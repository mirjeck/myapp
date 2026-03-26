let isLoggedInCache = false;
const guardListeners = new Set();

export function setAuthStateCache(nextValue) {
  isLoggedInCache = Boolean(nextValue);
}

export function getAuthStateCache() {
  return isLoggedInCache;
}

export function requestAuthGuard(path) {
  const safePath = typeof path === "string" ? path : "/";
  guardListeners.forEach((listener) => {
    try {
      listener(safePath);
    } catch {
      // no-op
    }
  });
}

export function subscribeAuthGuard(listener) {
  if (typeof listener !== "function") {
    return () => {};
  }
  guardListeners.add(listener);
  return () => {
    guardListeners.delete(listener);
  };
}

