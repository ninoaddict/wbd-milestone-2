import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { LoginForm } from '@/components/auth/login-form'
import { useUser } from '@/context/auth-context'
import { useEffect } from 'react'

export const Route = createFileRoute('/_navbar-layout/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { user, loading } = useUser()

  useEffect(() => {
    if (user) {
      router.navigate({
        to: '/',
        replace: true,
      })
    }
  }, [user, router])

  if (loading) {
    return <div>...Loading</div>
  }

  return (
    <div className="flex flex-col items-center justify-center px-5 min-h-screen bg-[#f4f2ee]">
      <div className="w-full max-w-[352px] rounded-lg mx-auto shadow-lg bg-white p-6">
        <div id="organic-div">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-medium mb-2">Sign in</h1>
            <p className="text-md font-normal text-gray-600">
              Stay updated on your professional world.
            </p>
          </div>
        </div>

        <LoginForm />
      </div>

      <div className="mt-6 text-center">
        New to LinkinPurry?
        <Link
          to="/register"
          className="text-blue-600 font-semibold hover:underline"
        >
          &nbsp;Join now
        </Link>
      </div>
    </div>
  )
}
