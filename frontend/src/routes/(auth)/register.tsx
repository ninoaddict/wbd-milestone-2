import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { RegisterForm } from '@/components/auth/register-form'
import { useUser } from '@/context/auth-context'
import { useEffect } from 'react'

export const Route = createFileRoute('/(auth)/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { user, loading } = useUser()

  useEffect(() => {
    if (user && !loading) {
      router.navigate({
        to: '/',
        replace: true,
      })
    }
  }, [user, router, loading])

  if (loading) {
    return <div>...Loading</div>
  }

  return (
    <div className="flex flex-col items-center justify-center px-5 min-h-screen bg-[#f4f2ee]">
      <h1 className="sm:text-2xl text-xl font-medium text-center mb-4">
        Make the most of your professional life
      </h1>
      <div className="w-full max-w-md rounded-lg mx-auto shadow-lg bg-white p-6">
        <RegisterForm />
      </div>

      <div className="mt-6 text-center">
        Already on LinkinPurry?
        <Link
          to="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          &nbsp;Sign in
        </Link>
      </div>
    </div>
  )
}
