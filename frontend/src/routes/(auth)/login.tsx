import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/login-form";

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center px-5 min-h-screen bg-[#f4f2ee]">
      <div className="w-full max-w-[352px] rounded-lg mx-auto shadow-lg bg-white p-6">
        <div id="organic-div">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-medium mb-1">Sign in</h1>
            <p className="text-sm font-normal text-gray-600">
              Stay updated on your professional world.
            </p>
          </div>
        </div>

        <LoginForm />
      </div>

      <div className="mt-6 text-center">
        New to LinkinPurry?
        <a
          href="/register"
          className="text-blue-600 font-semibold hover:underline"
        >
          &nbsp;Join now
        </a>
      </div>
    </div>
  );
}
