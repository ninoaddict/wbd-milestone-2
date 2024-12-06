import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { UserContextValue } from "@/context/auth-context";
import { Navbar } from "@/components/ui/navbar";
import NotFound from "@/components/not-found/not-found";
import { socket } from "@/services/socket";
import { useUser } from "@/context/auth-context";
import { useEffect } from "react";

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
  const { user, loading } = useUser();
  useEffect(() => {
    if (!loading && user?.id) {
      socket.connect();
    }
    if (!loading && !user?.id) {
      socket.disconnect();
    }
    return () => {
      socket.disconnect();
    };
  }, [user?.id, loading]);

  return (
    <>
      <Navbar />
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
