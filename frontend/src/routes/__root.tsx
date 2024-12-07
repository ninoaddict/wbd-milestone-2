import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { UserContextValue } from "@/context/auth-context";
import { Navbar } from "@/components/ui/navbar";
import NotFound from "@/components/not-found/not-found";
import { socket } from "@/services/socket";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { PUBLIC_VAPID_KEY } from "@/config";
import { api } from "@/lib/api";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: UserContextValue;
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return <NotFound />;
  },
});

function RootComponent() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user?.id && !loading) {
      socket.connect();
    }
    if (!user?.id && !loading) {
      socket.disconnect();
    }

    const managePushSubscription = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.ready;

        if (user?.id) {
          const subscription = await registration.pushManager.getSubscription();
          if (!subscription) {
            try {
              const newSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: PUBLIC_VAPID_KEY,
              });

              await api.post("/notification/subscribe", {
                subscription: newSubscription,
              });
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            try {
              await subscription.unsubscribe();
              await api.post("/notification/unsubscribe", {
                endpoint: subscription.endpoint,
              });
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    };

    managePushSubscription();

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  return (
    <>
      <Navbar />
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
