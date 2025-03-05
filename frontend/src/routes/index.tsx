import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import Loading from "@/components/loading/loading";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  pendingComponent: Loading,
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({
        to: "/feed",
      });
    }
  },
});

function HomeComponent() {
  return (
    <div className="flex py-[100px] justify-center">
      <div className="ml-[50px] mr-[50px] xl:mr-[0px] mt-[140px] xl2:mt-[0px] justify-center items-center flex flex-col">
        <p className="text-3xl lg:text-5xl font-normal flex justify-center text-center items-center">
          Welcome to your professional community
        </p>
        <Link
          to="/login"
          className="text-base md:text-lg bg-blue-600 py-1 md:py-1 px-10 sm:px-20 md:px-40 rounded-3xl text-white items-center flex mt-[20px] border border-solid border-blue-600 hover:text-blue-600 hover:bg-white"
        >
          Sign in with Email
        </Link>
        <p className="text-xs md:text-sm font-normal flex justify-center text-center items-center mt-[20px] text-gray-400">
          By signing in or registering, you agree to LinkedPurry User Agreement,
          Privacy Policy, and Cookie Policy.
        </p>
        <p className="text-sm md:text-base font-normal flex justify-center text-center items-center mt-4 md:mt-[20px] text-gray-500 space-x-1">
          <span>New to LinkedPurry?</span>
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
          <span>here!</span>
        </p>
      </div>
      <div className="flex justify-end">
        <img
          src="/guy_working.svg"
          alt="guy working hard"
          className="w-[100%] h-[100%] hidden xl2:block"
        ></img>
      </div>
    </div>
  );
}
