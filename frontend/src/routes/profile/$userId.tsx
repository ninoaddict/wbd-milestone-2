import { createFileRoute } from "@tanstack/react-router";
import { getProfile } from "@/services/profile";
import { queryOptions } from "@tanstack/react-query";
import ProfilePage from "@/components/profile/profile";
import { useAuth } from "@/context/auth-context";
import SelfProfilePage from "@/components/profile/self-profile";
import NotFound from "@/components/not-found/not-found";
import Loading from "@/components/loading/loading";

const profileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["profile", { userId }],
    queryFn: () => getProfile(userId),
  });

export const Route = createFileRoute("/profile/$userId")({
  component: RouteComponent,
  errorComponent: NotFound,
  pendingComponent: Loading,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    return queryClient.ensureQueryData(profileQueryOptions(userId));
  },
});

function RouteComponent() {
  const userId = Route.useParams().userId;
  const { user } = useAuth();
  const profile = Route.useLoaderData();

  if (!profile) {
    return <NotFound />;
  }

  if (!user || user.id !== userId) {
    return <ProfilePage profile={profile} userId={BigInt(userId)} />;
  } else {
    return <SelfProfilePage profile={profile} />;
  }
}
