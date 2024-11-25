import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { User } from "@/domain/interfaces/user.interface";
import { getUser } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export interface UserContextValue {
  user: User | undefined | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | undefined | null>> | null;
}

export const UserContext = createContext<UserContextValue>({
  user: undefined,
  loading: true,
  setUser: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getUser(),
  });

  const value = useMemo(
    () => ({ user: data, loading: isLoading, setUser: null }),
    [data, isLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
