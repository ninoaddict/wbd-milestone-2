import { createFileRoute, ErrorComponent } from '@tanstack/react-router'
import { getProfile } from '@/services/profile'
import { queryOptions, useQuery } from '@tanstack/react-query'
import ProfilePage from '@/components/profile/profile'
import { useUser } from '@/context/auth-context'
import SelfProfilePage from '@/components/profile/self-profile'
import NotFound from '@/components/not-found/not-found'
import Loading from '@/components/loading/loading'

const profileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['profile', { userId }],
    queryFn: () => getProfile(userId),
  })

export const Route = createFileRoute('/profile/$userId')({
  component: RouteComponent,
  errorComponent: NotFound,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    return queryClient.ensureQueryData(profileQueryOptions(userId))
  },
})

function RouteComponent() {
  const userId = Route.useParams().userId
  const { user, loading } = useUser()
  const { data: profile, isLoading: profileLoading } = useQuery(
    profileQueryOptions(userId),
  )

  if (loading || profileLoading) {
    return <Loading />
  }

  if (!profile) {
    return <NotFound />
  }

  if (!user || user.id !== userId) {
    return <ProfilePage profile={profile} />
  } else {
    return <SelfProfilePage profile={profile} />
  }
}
