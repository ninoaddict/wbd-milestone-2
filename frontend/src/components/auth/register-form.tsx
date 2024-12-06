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
import { useUser } from "@/context/auth-context";
import { useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { register, RegisterPayload } from "@/services/auth";
import { AxiosError } from "axios";

const registerFormSchema = z
  .object({
    username: z
      .string({ required_error: "Username cannot be empty" })
      .min(2, { message: "Username must be at least 2 characters" }),
    email: z
      .string({ required_error: "Email cannot be empty" })
      .email({ message: "Invalid email format" }),
    name: z
      .string({ required_error: "Full name cannot be empty" })
      .min(3, { message: "Name must be at least 3 characters" }),
    password: z
      .string({ required_error: "Password cannot be empty" })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string({ required_error: "Confirm password cannot be empty" })
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const RegisterForm = () => {
  const { setUser } = useUser();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: RegisterPayload) => {
      return register(payload);
    },
    onSuccess: (data) => {
      setUser(data);
      router.navigate({
        to: "/",
        replace: true,
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message);
      } else {
        console.error("Unexpected error:", err);
      }
    },
  });

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      username: "",
      name: "",
      password: "",
      confirmPassword: "",
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
          name="email"
          render={({ field }) => (
            <FormItem className="pb-1 md:pb-3">
              <FormLabel>Email</FormLabel>
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
                    placeholder="Email"
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
          name="username"
          render={({ field }) => (
            <FormItem className="pb-1 md:pb-3">
              <FormLabel>Username</FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                  </svg>
                </div>
                <FormControl>
                  <Input
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-5"
                    placeholder="Username"
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
          name="name"
          render={({ field }) => (
            <FormItem className="pb-1 md:pb-3">
              <FormLabel>Full Name</FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    fill="currentColor"
                    viewBox="0 0 416.979 416.979"
                    xmlSpace="preserve"
                  >
                    <g>
                      <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85   c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786   c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576   c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765   c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z" />
                    </g>
                  </svg>
                </div>
                <FormControl>
                  <Input
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-5"
                    placeholder="Full Name"
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
            <FormItem className="pb-1 md:pb-3">
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="pb-5">
              <FormLabel>Confirm Password</FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-gray-400"
                    fill="currentColor"
                  >
                    <path d="m12 1c-6.074 0-11 4.926-11 11s4.926 11 11 11 11-4.926 11-11-4.926-11-11-11zm-1.5 15.5-4.5-4.5 1.5-1.5 3 3 5.956-5.956 1.5 1.413z" />
                  </svg>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
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
          Register
        </button>
      </form>
    </Form>
  );
};
