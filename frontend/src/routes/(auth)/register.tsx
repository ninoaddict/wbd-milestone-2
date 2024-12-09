import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { RegisterForm } from "@/components/auth/register-form";
import Loading from "@/components/loading/loading";

export const Route = createFileRoute("/(auth)/register")({
  component: RouteComponent,
  pendingComponent: Loading,
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
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
  );
}
