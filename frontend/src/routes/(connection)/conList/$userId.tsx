import * as React from 'react'
import { createFileRoute, ErrorComponent } from '@tanstack/react-router'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { getConnectionsList } from '@/services/userList'
import { deleteConnection } from '@/services/connection'

const connectionListQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['connectionList', { userId }],
    queryFn: () => getConnectionsList(userId),
})

export const Route = createFileRoute('/(connection)/conList/$userId')({
  component: ConListComponent,
})

function ConListComponent() {
  const userId = Route.useParams().userId;
  const { data: userList } = useQuery(connectionListQueryOptions(userId));

  const mutationDelete = useMutation({
    mutationFn: (userId: bigint) => deleteConnection(userId),
    onSuccess: () => {
      console.log('Connection request sent successfully!');
    },
    onError: (error) => {
      console.error('Error sending connection request:', error);
    }
  });

  const deleteConnectionRequest = (userId : bigint) => {
    console.log(userId);
    mutationDelete.mutate(userId);
  }

  console.log(userList);

  return (
    <div className='min-h-screen w-full bg-[#f4f2ee] flex flex-col'>
      <main className='flex justify-center items-center mt-[150px]'>
        <section id='connection-list' className='flex justify-center items-center'>
          <div id='connection-container' className='bg-white rounded-t-md w-4/6 shadow-lg'>
            <header className='border-solid border-gray-200 border p-[10px] rounded-t-md'>
              <h2 className='text-xl'>Connections</h2>
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
                          <p className="text-[17px]">{item.user.name}</p>
                          <p className="text-[14px] text-gray-500">
                            Username: {item.user.username}
                          </p>
                        </div>
                        <div className="flex items-center">
                        <a href='/message' className='border border-blue-700 border-solid px-[10px] py-[4px] rounded-[15px] text-blue-700 text-[14px] mx-[5px] hover:text-white hover:bg-blue-700'>Message</a>
                        <button onClick={() => deleteConnectionRequest(item.user.id)} className='border border-red-700 border-solid px-[10px] py-[4px] rounded-[15px] text-red-700 text-[14px] mx-[5px] hover:text-white hover:bg-red-700'>Unconnect</button>
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