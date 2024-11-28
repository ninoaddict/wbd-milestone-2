// import type React from "react";
// import { useEffect } from "react";
// import type { ServerToClientEvents } from "~/server/socket/index";
// import { socket } from "~/utils/socket";

// /**
//  *
//  * @param event event name which are registered on the server (manual type declaration)
//  * @param callback the function that runs when the server emits this event.
//  * @param dependencies the dependencies that will be passed to useEffect
//  *
//  * @example
//  * ```ts
//  * useSubscription("example", (data) => {
//  *  console.log(data);
//  * });
//  * ```
//  */
// function useSubscription<T extends keyof ServerToClientEvents>(
//   event: T,
//   callback: ServerToClientEvents[T],
//   dependencies: React.DependencyList = []
// ) {
//   useEffect(() => {
//     // @ts-expect-error typing is safe by the interface
//     socket.on(event, callback);

//     return () => {
//       // @ts-expect-error typing is safe by the interface
//       socket.off(event, callback);
//     };
//     // make so that callback depends on the dependencies
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [event, ...dependencies]);
// }

// export default useSubscription;
