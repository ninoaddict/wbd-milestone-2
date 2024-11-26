import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { getProfile } from "@/services/profile";
import { queryOptions, useQuery } from "@tanstack/react-query";
import ProfilePage from "@/components/profile/profile";
import { useUser } from "@/context/auth-context";
import SelfProfilePage from "@/components/profile/self-profile";

const profileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["profile", { userId }],
    queryFn: () => getProfile(userId),
  });

export const Route = createFileRoute("/profile/$userId")({
  component: RouteComponent,
  errorComponent: ErrorComponent,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    return queryClient.ensureQueryData(profileQueryOptions(userId));
  },
});

function RouteComponent() {
  const userId = Route.useParams().userId;
  const { user, loading } = useUser();
  const { data: profile } = useQuery(profileQueryOptions(userId));
  if (!profile) {
    return <div>Unexpected error occured</div>;
  }
  if (!user || user.id !== userId) {
    return ProfilePage(profile);
  } else {
    return SelfProfilePage(profile);
  }
}
