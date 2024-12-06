import * as React from 'react'
import { createFileRoute, ErrorComponent } from '@tanstack/react-router'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { getUserList } from '@/services/userList'
import { sendConnectionReq } from '@/services/connection'
import { useUser } from '@/context/auth-context'
import { send } from 'process'

const userListQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['userList', { userId }],
    queryFn: () => getUserList(userId),
  })

export const Route = createFileRoute('/(connection)/userList/$userId')({
  component: ConnectionUserListComponent,
  errorComponent: ErrorComponent,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    return queryClient.ensureQueryData(userListQueryOptions(userId))
  },
})

function ConnectionUserListComponent() {
  const userId = Route.useParams().userId
  const { data: userList } = useQuery(userListQueryOptions(userId))

  console.log(userList)

  const mutationSend = useMutation({
    mutationFn: (userId: bigint) => sendConnectionReq(userId),
    onSuccess: () => {
      console.log('Connection request sent successfully!')
    },
    onError: (error) => {
      console.error('Error sending connection request:', error)
    },
  })

  const sendConnectionRequest = (userId: bigint) => {
    console.log(userId)
    mutationSend.mutate(userId)
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f2ee] flex flex-col">
      <main className="flex justify-center items-center mt-[150px] mb-[50px]">
        <section
          id="connection-list"
          className="flex justify-center items-center"
        >
          <div
            id="connection-container"
            className="bg-white rounded-t-md w-4/6"
          >
            <header className="border-solid border-gray-200 border p-[10px] rounded-t-md">
              <h2 className="text-xl">User Lists</h2>
            </header>
            <main>
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
                          <p className="text-[17px]">{item.name}</p>
                          <p className="text-[14px] text-gray-500">
                            Username: {item.username}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => sendConnectionRequest(item.id)}
                            className="border border-blue-700 border-solid px-[10px] py-[4px] rounded-[15px] text-blue-700 text-[14px] mx-[5px] hover:text-white hover:bg-blue-700"
                          >
                            Connect
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
  )
}
