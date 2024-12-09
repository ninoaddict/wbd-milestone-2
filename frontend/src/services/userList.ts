import { api } from "@/lib/api";
import {
  UserList,
  UserListQueried,
} from "@/domain/interfaces/connection.interface";

interface UserListResponse {
  body: UserList;
  message: string;
}

interface UserListQueriedResponse {
  body: UserListQueried;
  message: string;
}

export const getUserList = async (query: string) => {
  const res = (await api
    .get(`/users?query=${query}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("User lists not found");
      }
      throw err;
    })) as UserListResponse;
  return res.body;
};

export const getConnectionsList = async (userId: string) => {
  const res = (await api
    .get(`/connection/${userId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("User lists not found");
      }
      throw err;
    })) as UserListQueriedResponse;
  return res.body;
};

export const getRequestsList = async () => {
  const res = (await api
    .get(`/connection/requests`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("User lists not found");
      }
      throw err;
    })) as UserListQueriedResponse;
  return res.body;
};
