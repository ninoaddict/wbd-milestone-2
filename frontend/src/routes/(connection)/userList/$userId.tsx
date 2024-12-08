import * as React from "react";
import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { getUserList } from "@/services/userList";
import {
  sendConnectionReq,
  acceptConnection,
  rejectConnection,
  deleteConnection,
} from "@/services/connection";
import { UserShortInfo } from "@/domain/interfaces/connection.interface";

const userListQueryOptions = (query: string) =>
  queryOptions({
    queryKey: ["userList", { query }],
    queryFn: () => getUserList(query),
  });

export const Route = createFileRoute("/(connection)/userList/$userId")({
  component: ConnectionUserListComponent,
  errorComponent: ErrorComponent,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    return queryClient.ensureQueryData(userListQueryOptions(userId));
  },
});

function ConnectionUserListComponent() {
  const [query, setQuery] = React.useState("");

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

  const mutationDelete = useMutation({
    mutationFn: (userId: bigint) => deleteConnection(userId),
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

  const deleteConnectionRequest = (userId: bigint) => {
    console.log(userId);
    mutationDelete.mutate(userId);
  };

  const mutationSend = useMutation({
    mutationFn: (userId: bigint) => sendConnectionReq(userId),
    onSuccess: () => {
      console.log("Connection request sent successfully!");
    },
    onError: (error) => {
      console.error("Error sending connection request:", error);
    },
  });

  const sendConnectionRequest = (userId: bigint) => {
    console.log(userId);
    mutationSend.mutate(userId);
  };

  const changeQuery = (e: any) => {
    setQuery(e.target.value);
  };

  function ConnectionButtonComponent(info: UserShortInfo) {
    if (info.status === "disconnected") {
      return (
        <button
          type="submit"
          onClick={() => {
            sendConnectionRequest(info.id);
            window.location.reload();
          }}
          className="border border-blue-700 border-solid mobile:px-[10px] mobile:py-[4px] text-[12px] px-[10px] py-[4px] rounded-[15px] text-blue-700 mobile:text-[14px] xs:ml-[5px] ml-[0px] mr-[5px] hover:text-white hover:bg-blue-700"
        >
          Connect
        </button>
      );
    } else if (info.status === "requesting") {
      return (
        <p className="border border-gray-700 border-solid mobile:px-[10px] mobile:py-[4px] text-[12px] px-[10px] py-[4px] rounded-[15px] mt-[5px] xs:mt-[0px] text-gray-700 mobile:text-[14px] xs:ml-[5px] ml-[0px] mr-[5px]">
          Requesting
        </p>
      );
    } else if (info.status === "requested") {
      return (
        <div className="flex items-center justify-center flex-col mobile:flex-row">
          <button
            type="submit"
            onClick={() => {
              clickIgnore(info.id);
              window.location.reload();
            }}
            className="mobile:px-[10px] mobile:py-[4px] px-[10px] py-[4px] text-[12px] text-gray-700 mobile:text-[14px] xs:ml-[5px] ml-[0px] mr-[5px] hover:bg-gray-100"
          >
            Ignore
          </button>
          <button
            type="submit"
            onClick={() => {
              clickAccept(info.id);
              window.location.reload();
            }}
            className="border border-blue-700 border-solid mobile:px-[10px] mobile:py-[4px] text-[12px] px-[10px] py-[4px] rounded-[15px] text-blue-700 mobile:text-[14px] mx-[5px] hover:text-white hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      );
    } else if (info.status === "connected") {
      return (
        <div className="flex items-center justify-center flex-row xs:flex-col mobile:flex-row mt-[5px]">
          <Link
            to="/chat"
            className="border border-blue-700 border-solid mobile:px-[10px] mobile:py-[4px] mobile:mb-[0px] xs:mb-[5px] mb-[0px] px-[10px] py[4px] text-[12px] rounded-[15px] text-blue-700 mobile:text-[14px] xs:ml-[5px] ml-[0px] mr-[5px] hover:text-white hover:bg-blue-700"
          >
            Message
          </Link>
          <button
            type="submit"
            onClick={() => {
              deleteConnectionRequest(info.id);
              window.location.reload();
            }}
            className="border border-red-700 border-solid mobile:px-[10px] mobile:py-[4px] px-[10px] py[4px] text-[12px] rounded-[15px] text-red-700 mobile:text-[14px] mx-[5px] hover:text-white hover:bg-red-700"
          >
            Unconnect
          </button>
        </div>
      );
    } else if (info.status === "self") {
      return (
        <div className="border border-gray-700 border-solid mobile:px-[10px] mobile:py-[4px] text-[12px] px-[10px] py-[4px] rounded-[15px] text-gray-700 mobile:text-[14px] xs:ml-[5px] ml-[0px] mr-[5px]">
          You
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  const userId = Route.useParams().userId;

  const { data: userList } = useQuery(userListQueryOptions(query));

  return (
    <div className="min-h-screen w-full bg-[#f4f2ee] flex flex-col">
      <main className="flex justify-center items-center mt-[120px] mb-[50px] flex-col">
        <section
          id="search-bars"
          className="flex flex-col-reverse lg:flex-row justify-center items-center mb-[10px]"
        >
          <input
            onChange={changeQuery}
            type="text"
            placeholder="Search accounts here"
            className="w-[200px] xs:w-[300px] py-[5px] px-[10px] mobile:w-[500px] rounded-md border border-solid border-black"
          ></input>
          {userId !== "0" && (
            <a
              href={`/conReq/${userId}`}
              className="mb-[10px] lg:mb-[0px] py-[5px] px-[10px] bg-blue-950 ml-[10px] text-white rounded-md"
            >
              Manage Requests
            </a>
          )}
        </section>
        <section
          id="connection-list"
          className="flex justify-center items-center"
        >
          <div
            id="connection-container"
            className="bg-white rounded-t-md w-5/6"
          >
            <header className="border-solid border-gray-200 border p-[10px] rounded-t-md">
              <h2 className="text-xl">User Lists</h2>
            </header>
            <main>
              <ul>
                {userList?.length == 0 && (
                  <div className="p-[10px] w-[300px]">Users not found</div>
                )}
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
                      <div className="flex flex-1 justify-between xs:flex-row flex-col">
                        <div className="flex flex-col">
                          <a
                            href={`/profile/${item.id}`}
                            className="text-[17px] text-blue-600"
                          >
                            {item.name}
                          </a>
                          <p className="text-[14px] text-gray-500">
                            Username: {item.username}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {ConnectionButtonComponent(item)}
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
