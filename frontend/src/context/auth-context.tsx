import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@/domain/interfaces/user.interface";
import { getUser } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export interface UserContextValue {
  user: User | undefined | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | undefined | null>>;
}

export const UserContext = createContext<UserContextValue>({
  user: undefined,
  loading: true,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<User | undefined | null>();
  const { data, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: () => getUser(),
  });
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(isLoading);
    if (!isLoading) {
      setUser(data);
    }
  }, [data, isLoading]);
  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
