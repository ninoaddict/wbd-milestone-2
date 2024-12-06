import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { UserProvider, useAuth } from "./context/auth-context";
import "./index.css";
import Loading from "./components/loading/loading";
import { Suspense } from "react";

const queryClient = new QueryClient();

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: {
      user: null,
      loading: true,
      setUser: () => {},
    },
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

function App() {
  const auth = useAuth();
  if (auth.loading) {
    return <Loading />;
  }
  return <RouterProvider router={router} context={{ queryClient, auth }} />;
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <App />
      </UserProvider>
    </QueryClientProvider>
  );
}
