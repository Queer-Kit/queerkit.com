export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { session, status } = useAuth();

  if (status.value === "pending") {
    await new Promise<void>((resolve) => {
      const stop = watch(status, (val) => {
        if (val !== "pending") {
          stop();
          resolve();
        }
      });
    });
  }

  // Only block specific pages for unauthenticated users if needed
  if (!session.value) {
    if (to.path === "/auth") {
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
