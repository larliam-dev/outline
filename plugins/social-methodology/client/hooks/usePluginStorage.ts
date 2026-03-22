import * as React from "react";

const NAMESPACE = "outline_sm_";

/**
 * Persists React state to localStorage under a namespaced key.
 * Reads the stored value on first render; falls back to `initial` if nothing
 * is stored or if parsing fails. The returned setter has the same API as the
 * one returned by `React.useState`.
 *
 * @param key - Storage key, prefixed with "outline_sm_" to avoid collisions.
 * @param initial - Default value used when no stored value exists.
 * @returns Tuple of [value, setter].
 */
export function usePluginStorage<T>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const storageKey = NAMESPACE + key;

  const [state, setState] = React.useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw !== null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setAndPersist: React.Dispatch<React.SetStateAction<T>> =
    React.useCallback(
      (valueOrUpdater) => {
        setState((prev) => {
          const next =
            typeof valueOrUpdater === "function"
              ? (valueOrUpdater as (prev: T) => T)(prev)
              : valueOrUpdater;
          try {
            localStorage.setItem(storageKey, JSON.stringify(next));
          } catch {
            // Ignore quota or security errors.
          }
          return next;
        });
      },
      [storageKey]
    );

  return [state, setAndPersist];
}

/**
 * Removes all plugin storage keys from localStorage.
 * After calling this, components using usePluginStorage will reinitialize
 * to their default values on next mount.
 */
export function clearPluginStorage(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(NAMESPACE)) {
      keysToRemove.push(key);
    }
  }
  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
}
