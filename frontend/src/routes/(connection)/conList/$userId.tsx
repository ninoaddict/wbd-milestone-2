import * as React from "react";
import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { getConnectionsList } from "@/services/userList";
import { deleteConnection } from "@/services/connection";

const connectionListQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["connectionList", { userId }],
    queryFn: () => getConnectionsList(userId),
  });

export const Route = createFileRoute("/(connection)/conList/$userId")({
  component: ConListComponent,
});

function ConListComponent() {
  const userId = Route.useParams().userId;

  const { data: userList } = useQuery(connectionListQueryOptions(userId));

  const mutationDelete = useMutation({
    mutationFn: (userId: bigint) => deleteConnection(userId),
    onSuccess: () => {
      console.log("Connection request sent successfully!");
    },
    onError: (error) => {
      console.error("Error sending connection request:", error);
    },
  });

  const deleteConnectionRequest = (userId: bigint) => {
    mutationDelete.mutate(userId);
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
            className="bg-white rounded-t-md w-11/12 shadow-lg"
          >
            <header className="border-solid border-gray-200 border p-[10px] rounded-t-md">
              <h2 className="text-xl">{userList?.length} Connections</h2>
            </header>
            <main>
              {userList?.length == 0 && (
                <div className="p-[10px] w-[300px]">
                  This user has no connections
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
                      <div className="flex flex-1 justify-between flex-col sm:flex-row">
                        <div className="flex flex-col">
                          <p className="text-[17px] text-blue-600">
                            {item.user.name}
                          </p>
                          <p className="text-[14px] text-gray-500">
                            Username: {item.user.username}
                          </p>
                        </div>
                        <div className="flex items-center mt-[5px] sm:mt-[0px]">
                          <Link
                            to="/chat"
                            className="border border-blue-700 border-solid mobile:px-[10px] mobile:py-[4px] px-[10px] py-[4px] text-[12px] rounded-[15px] text-blue-700 mobile:text-[14px] sm:ml-[5px] ml-[0px] mr-[5px] hover:text-white hover:bg-blue-700"
                          >
                            Message
                          </Link>
                          <button
                            onClick={() => {
                              deleteConnectionRequest(item.user.id);
                              window.location.reload();
                            }}
                            className="border border-red-700 border-solid mobile:px-[10px] mobile:py-[4px] px-[10px] py-[4px] text-[12px] rounded-[15px] text-red-700 mobile:text-[14px] sm:ml-[5px] ml-[0px] mr-[5px] hover:text-white hover:bg-red-700"
                          >
                            Unconnect
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
