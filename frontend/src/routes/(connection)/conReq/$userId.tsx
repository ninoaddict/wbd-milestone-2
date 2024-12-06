import * as React from "react";
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { getRequestsList } from "@/services/userList";
import { acceptConnection, rejectConnection } from "@/services/connection";
import { useUser } from "@/context/auth-context";

const connectionListQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["connectionList", { userId }],
    queryFn: () => getRequestsList(userId),
  });

export const Route = createFileRoute("/(connection)/conReq/$userId")({
  component: ConReqComponent,
});

function ConReqComponent() {
  const infoUser = useUser();
  const userId = Route.useParams().userId;

  const { data: userList } = useQuery(connectionListQueryOptions(userId));
  console.log(userList);

  const mutationAccept = useMutation({
    mutationFn: (userId: bigint) => acceptConnection(userId),
    onSuccess: () => {
      console.log("Connection request sent successfully!");
    },
    onError: (error) => {
      console.error("Error sending connection request:", error);
    },
  });

  const mutationReject = useMutation({
    mutationFn: (userId: bigint) => rejectConnection(userId),
    onSuccess: () => {
      console.log("Connection request sent successfully!");
    },
    onError: (error) => {
      console.error("Error sending connection request:", error);
    },
  });

  const clickAccept = async (userId: bigint) => {
    console.log(userId);
    mutationAccept.mutate(userId);
  };

  const clickIgnore = async (userId: bigint) => {
    console.log(userId);
    mutationReject.mutate(userId);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f2ee] flex flex-col">
      <main className="flex justify-center items-center mt-[150px]">
        <section
          id="connection-list"
          className="flex justify-center items-center"
        >
          <div
            id="connection-container"
            className="bg-white rounded-t-md w-5/6"
          >
            <header className="border-solid border-gray-200 border p-[10px] rounded-t-md">
              <h2 className="text-xl">{userList?.length} Requests</h2>
            </header>
            <main>
              {userList?.length == 0 && (
                <div className="p-[10px] w-[300px]">
                  This user has no requests
                </div>
              )}
              <ul>
                {userList &&
                  userList.map((item, index) => (
                    <li
                      className="border-solid border-gray-200 border p-[10px] flex items-center"
                      key={index}
                    >
                      <div className="w-[8%] h-[8%] bg-gray-100 overflow-hidden relative mr-[7px] flex">
                        <img
                          src="/placeholder.png"
                          className="object-cover w-full h-full"
                        ></img>
                      </div>
                      <div className="flex flex-1 justify-between">
                        <div className="flex flex-col">
                          <p className="text-[17px] text-blue-600">
                            {item.user.name}
                          </p>
                          <p className="text-[14px] text-gray-500">
                            Worked at: {item.user.username}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => {
                              clickIgnore(item.user.id);
                              window.location.reload();
                            }}
                            className="px-[10px] py-[4px] text-gray-700 text-[14px] mx-[5px] hover:bg-gray-100"
                          >
                            Ignore
                          </button>
                          <button
                            onClick={() => {
                              clickAccept(item.user.id);
                              window.location.reload();
                            }}
                            className="border border-blue-700 border-solid px-[10px] py-[4px] rounded-[15px] text-blue-700 text-[14px] mx-[5px] hover:text-white hover:bg-blue-700"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </main>
          </div>
        </section>
      </main>
    </div>
  );
}
