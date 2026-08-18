// Routes rendered in the scoped editorial theme. On these the legacy dark NavBar
// hides itself (pages render their own cream EditorialHeader) and .app-content
// drops its 56px top padding. Add a route here when you convert its page to the
// editorial style. Everything NOT listed keeps the legacy dark app untouched.
export const EDITORIAL_ROUTES = new Set([
  '/',
  '/lambda-01758354-candidate',
  '/autonomous-fleet',
  '/flow-blindness-no-go',
  '/frozen-rung-pt-equivalence',
  '/pt-floor-audit',
  '/newman-lambda-01787854-candidate',
  '/what-we-know',
  '/shift-bridge-positivity',
  '/theorem-b-threshold',
  '/route-map',
  '/lambda-bounds',
]);

export function isEditorialRoute(pathname) {
  return EDITORIAL_ROUTES.has(pathname);
}
