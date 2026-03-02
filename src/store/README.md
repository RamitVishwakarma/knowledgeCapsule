# Store (Zustand)

Zustand stores live here. **Do not use React Context API** — Zustand is the primary state management solution for this project.

## When to create a store

- Shared client-side state that multiple components need to read/write
- State that needs to persist across page navigations (auth token, user preferences)
- Use `persist` middleware for state that should survive page refreshes

## Pattern: Non-persisted store

```ts
// store/uiStore.ts
import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

## Pattern: Persisted store (auth, preferences)

```ts
// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    { name: "auth-storage" }
  )
);
```

## Current stores

- `appStore.ts` — App-wide state: auth, topics, documents, UI state (sidebar, viewMode)

## Exception: Context API is allowed only when required by a third-party library

For example, `next-auth`'s `SessionProvider` must wrap the app — that is acceptable.
Any custom state should use Zustand.
