import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { login, LoginPayload } from "@/services/auth";
import { AxiosError } from "axios";
import { flushSync } from "react-dom";
import { useToast } from "@/hooks/use-toast";

const loginFormSchema = z.object({
  identifier: z
    .string({ required_error: "Email or username cannot be empty" })
    .min(2, { message: "Email or username must be at least 2 characters" }),
  password: z
    .string({ required_error: "Password cannot be empty" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const LoginForm = () => {
  const { setUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => {
      return login(payload);
    },
    onSuccess: (data) => {
      flushSync(() => {
        setUser(data);
      });
      router.invalidate();
      router.navigate({
        to: "/",
        replace: true,
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast({
          title: "Login Error",
          description: err.response?.data.message || "Unexpected error occured",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Error",
          description: "Unexpected error occured",
          variant: "destructive",
        });
      }
    },
  });

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="space-y-1"
      >
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem className="pb-4">
              <FormLabel>Email or Username</FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16"
                  >
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                  </svg>
                </div>
                <FormControl>
                  <Input
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-5"
                    placeholder="Email or username"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="pb-5">
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="w-4 h-4 text-gray-400"
                    fill="currentColor"
                  >
                    <path d="m400 224h-24v-72c0-83.8-68.2-152-152-152s-152 68.2-152 152v72h-24c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-192c0-26.5-21.5-48-48-48zm-104 0h-144v-72c0-39.7 32.3-72 72-72s72 32.3 72 72z" />
                  </svg>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...field}
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-5"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type="submit"
          className="text-white bg-blue-600 font-medium text-sm rounded-full py-3 w-full hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </Form>
  );
};
