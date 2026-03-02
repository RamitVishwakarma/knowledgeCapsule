// Type-safe route constants for Next.js navigation.
// Use these with router.push() or <Link href={...} /> instead of hardcoding strings.

export const appRoutes = {
  home: "/",
  dashboard: "/dashboard",
} as const;

export type AppRoute = (typeof appRoutes)[keyof typeof appRoutes];
