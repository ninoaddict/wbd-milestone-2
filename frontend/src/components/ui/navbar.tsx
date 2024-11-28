import { useUser } from "@/context/auth-context";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  Home,
  Menu,
  MessageSquare,
  Users,
  LogOut,
  LogIn,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/services/auth";
import { AxiosError } from "axios";
import { STORAGE_URL } from "@/lib/const";

export const Navbar = () => {
  const { user, loading, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      return logout();
    },
    onSuccess: () => {
      setUser(null);
      setIsLoggingOut(true);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message);
      } else {
        console.error("Unexpected error:", err);
      }
    },
  });

  useEffect(() => {
    if (isLoggingOut && !user) {
      router.navigate({ to: "/login", replace: false });
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, user, router]);

  if (loading) {
    return <div></div>;
  }

  return (
    <nav className="border-b border-b-[rgb(140,140,140,0.2)] bg-white fixed z-20 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 lg:gap-3">
          <Link to="/" className="text-[#0A66C2]">
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
            </svg>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          <NavButton to="/" icon={<Home className="h-6 w-6" />} text="Home" />
          {user && (
            <>
              {" "}
              <NavButton
                to="/mynetwork"
                icon={<Users className="h-6 w-6" />}
                text="My Network"
              />
              <NavButton
                to="/messaging"
                icon={<MessageSquare className="h-6 w-6" />}
                text="Messaging"
              />
            </>
          )}
          <NavButton
            to="/notifications"
            icon={<Bell className="h-6 w-6" />}
            text="Notifications"
          />
          {!user && (
            <NavButton
              to="/login"
              icon={<LogIn className="h-6 w-6" />}
              text="Login"
            />
          )}
          {user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-col items-center w-[72px] py-1 hover:text-neutral-600">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={
                          user.profile_photo_path !== ""
                            ? `${STORAGE_URL}/${user.profile_photo_path}`
                            : undefined
                        }
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">Me</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => mutation.mutate()}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <div className="h-100 w-[1px] bg-gray-200" />
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <MessageSquare className="h-6 w-6" />
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-5 w-5" /> Home
                </Link>
                {user && (
                  <>
                    <Link
                      to="/"
                      className="flex items-center gap-2 text-lg font-semibold"
                      onClick={() => setIsOpen(false)}
                    >
                      <Users className="h-5 w-5" /> My Network
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center gap-2 text-lg font-semibold"
                      onClick={() => setIsOpen(false)}
                    >
                      <MessageSquare className="h-5 w-5" /> Messaging
                    </Link>
                  </>
                )}
                <Link
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  <Bell className="h-5 w-5" /> Notifications
                </Link>
                {user && (
                  <div
                    className="flex items-center gap-2 text-lg font-semibold cursor-pointer"
                    onClick={() => mutation.mutate()}
                  >
                    <LogOut className="h-5 w-5" /> Sign out
                  </div>
                )}
                {!user && (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="h-5 w-5" /> Login
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

function NavButton({
  to,
  icon,
  text,
  active = false,
}: {
  to: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center py-1 w-[78px] hover:text-neutral-600 ${
        active ? "text-neutral-900" : "text-neutral-500"
      }`}
    >
      {icon}
      <span className="text-xs whitespace-nowrap">{text}</span>
    </Link>
  );
}
