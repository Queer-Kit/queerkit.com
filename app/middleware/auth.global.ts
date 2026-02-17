export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { session, status } = useAuth();

  if (status.value === 'pending') {
    await new Promise<void>((resolve) => {
      const stop = watch(status, (val) => {
        if (val !== 'pending') {
          stop();
          resolve();
        }
      });
    });
  }

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/company/about', '/company/careers', '/branding', '/visitors', '/documents'];
  const isPublicRoute = publicRoutes.some(path => to.path === path || to.path.startsWith(path + '/'));

  // User is not authenticated
  if (!session.value) {
    // Always allow /auth routes (except the root /auth redirect)
    if (to.path.startsWith("/auth/")) {
      return;
    }

    if (to.path === "/auth") {
      return navigateTo("/auth/sign-in");
    }

    // If it's not a public route and not an auth route, redirect to sign-in
    if (!isPublicRoute) {
      return navigateTo("/auth/sign-in");
    }
  }

  // User is authenticated
  if (session.value) {
    if (to.path === "/auth/sign-in" || to.path === "/auth/sign-up") {
      return navigateTo("/");
    }
  }
});
