import { api } from "@/lib/api";
import { UserList } from "@/domain/interfaces/connection.interface";

interface UserListResponse {
  body: UserList;
  message: string;
}

export const sendConnectionReq = async (userId: bigint) => {
  const res = (await api
    .post(`/connection/send/${userId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("Failed to connect");
      }
      throw err;
    })) as UserListResponse;
  return res.body;
};

export const deleteConnection = async (userId: bigint) => {
  const res = (await api
    .delete(`/connection/delete/${userId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("Failed to connect");
      }
      throw err;
    })) as UserListResponse;
  return res.body;
};

export const acceptConnection = async (userId: bigint) => {
  const res = (await api
    .post(`/connection/accept/${userId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("Failed to connect");
      }
      throw err;
    })) as UserListResponse;
  return res.body;
};

export const rejectConnection = async (userId: bigint) => {
  const res = (await api
    .post(`/connection/reject/${userId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("Failed to connect");
      }
      throw err;
    })) as UserListResponse;
  return res.body;
};
