import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  socket,
  ClientToServerEvents,
  SocketResponse,
} from "@/services/socket";

type GetReturn<T extends keyof ClientToServerEvents> =
  NonNullable<Parameters<ClientToServerEvents[T]>[1]> extends (
    data: SocketResponse<infer U>
  ) => void
    ? U
    : never;

function useEmit<
  T extends keyof ClientToServerEvents,
  TData = Parameters<ClientToServerEvents[T]>[0],
>(
  event: T,
  options?: UseMutationOptions<GetReturn<T>, unknown, TData, unknown>
) {
  return useMutation({
    mutationFn: (data: TData) => {
      return new Promise<GetReturn<T>>((resolve, reject) => {
        // @ts-expect-error type lying so inference can be easy
        socket.emit(event, data, (res: SocketResponse) => {
          if (res.success) {
            resolve(res.data as GetReturn<T>);
          } else {
            reject(res.error);
          }
        });
      });
    },
    ...options,
  });
}

export default useEmit;
