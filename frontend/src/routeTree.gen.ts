/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as UsersIndexImport } from './routes/users/index'
import { Route as FeedIndexImport } from './routes/feed/index'
import { Route as ChatIndexImport } from './routes/chat/index'
import { Route as ProfileUserIdImport } from './routes/profile/$userId'
import { Route as ConnectionUserIdImport } from './routes/connection/$userId'
import { Route as ChatRoomIdImport } from './routes/chat/$roomId'
import { Route as authRegisterImport } from './routes/(auth)/register'
import { Route as authLoginImport } from './routes/(auth)/login'
import { Route as ConnectionRequestIndexImport } from './routes/connection/request/index'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const UsersIndexRoute = UsersIndexImport.update({
  id: '/users/',
  path: '/users/',
  getParentRoute: () => rootRoute,
} as any)

const FeedIndexRoute = FeedIndexImport.update({
  id: '/feed/',
  path: '/feed/',
  getParentRoute: () => rootRoute,
} as any)

const ChatIndexRoute = ChatIndexImport.update({
  id: '/chat/',
  path: '/chat/',
  getParentRoute: () => rootRoute,
} as any)

const ProfileUserIdRoute = ProfileUserIdImport.update({
  id: '/profile/$userId',
  path: '/profile/$userId',
  getParentRoute: () => rootRoute,
} as any)

const ConnectionUserIdRoute = ConnectionUserIdImport.update({
  id: '/connection/$userId',
  path: '/connection/$userId',
  getParentRoute: () => rootRoute,
} as any)

const ChatRoomIdRoute = ChatRoomIdImport.update({
  id: '/chat/$roomId',
  path: '/chat/$roomId',
  getParentRoute: () => rootRoute,
} as any)

const authRegisterRoute = authRegisterImport.update({
  id: '/(auth)/register',
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const authLoginRoute = authLoginImport.update({
  id: '/(auth)/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const ConnectionRequestIndexRoute = ConnectionRequestIndexImport.update({
  id: '/connection/request/',
  path: '/connection/request/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/login': {
      id: '/(auth)/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authLoginImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/register': {
      id: '/(auth)/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof authRegisterImport
      parentRoute: typeof rootRoute
    }
    '/chat/$roomId': {
      id: '/chat/$roomId'
      path: '/chat/$roomId'
      fullPath: '/chat/$roomId'
      preLoaderRoute: typeof ChatRoomIdImport
      parentRoute: typeof rootRoute
    }
    '/connection/$userId': {
      id: '/connection/$userId'
      path: '/connection/$userId'
      fullPath: '/connection/$userId'
      preLoaderRoute: typeof ConnectionUserIdImport
      parentRoute: typeof rootRoute
    }
    '/profile/$userId': {
      id: '/profile/$userId'
      path: '/profile/$userId'
      fullPath: '/profile/$userId'
      preLoaderRoute: typeof ProfileUserIdImport
      parentRoute: typeof rootRoute
    }
    '/chat/': {
      id: '/chat/'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatIndexImport
      parentRoute: typeof rootRoute
    }
    '/feed/': {
      id: '/feed/'
      path: '/feed'
      fullPath: '/feed'
      preLoaderRoute: typeof FeedIndexImport
      parentRoute: typeof rootRoute
    }
    '/users/': {
      id: '/users/'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof UsersIndexImport
      parentRoute: typeof rootRoute
    }
    '/connection/request/': {
      id: '/connection/request/'
      path: '/connection/request'
      fullPath: '/connection/request'
      preLoaderRoute: typeof ConnectionRequestIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/login': typeof authLoginRoute
  '/register': typeof authRegisterRoute
  '/chat/$roomId': typeof ChatRoomIdRoute
  '/connection/$userId': typeof ConnectionUserIdRoute
  '/profile/$userId': typeof ProfileUserIdRoute
  '/chat': typeof ChatIndexRoute
  '/feed': typeof FeedIndexRoute
  '/users': typeof UsersIndexRoute
  '/connection/request': typeof ConnectionRequestIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/login': typeof authLoginRoute
  '/register': typeof authRegisterRoute
  '/chat/$roomId': typeof ChatRoomIdRoute
  '/connection/$userId': typeof ConnectionUserIdRoute
  '/profile/$userId': typeof ProfileUserIdRoute
  '/chat': typeof ChatIndexRoute
  '/feed': typeof FeedIndexRoute
  '/users': typeof UsersIndexRoute
  '/connection/request': typeof ConnectionRequestIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/(auth)/login': typeof authLoginRoute
  '/(auth)/register': typeof authRegisterRoute
  '/chat/$roomId': typeof ChatRoomIdRoute
  '/connection/$userId': typeof ConnectionUserIdRoute
  '/profile/$userId': typeof ProfileUserIdRoute
  '/chat/': typeof ChatIndexRoute
  '/feed/': typeof FeedIndexRoute
  '/users/': typeof UsersIndexRoute
  '/connection/request/': typeof ConnectionRequestIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/login'
    | '/register'
    | '/chat/$roomId'
    | '/connection/$userId'
    | '/profile/$userId'
    | '/chat'
    | '/feed'
    | '/users'
    | '/connection/request'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/login'
    | '/register'
    | '/chat/$roomId'
    | '/connection/$userId'
    | '/profile/$userId'
    | '/chat'
    | '/feed'
    | '/users'
    | '/connection/request'
  id:
    | '__root__'
    | '/'
    | '/(auth)/login'
    | '/(auth)/register'
    | '/chat/$roomId'
    | '/connection/$userId'
    | '/profile/$userId'
    | '/chat/'
    | '/feed/'
    | '/users/'
    | '/connection/request/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  authLoginRoute: typeof authLoginRoute
  authRegisterRoute: typeof authRegisterRoute
  ChatRoomIdRoute: typeof ChatRoomIdRoute
  ConnectionUserIdRoute: typeof ConnectionUserIdRoute
  ProfileUserIdRoute: typeof ProfileUserIdRoute
  ChatIndexRoute: typeof ChatIndexRoute
  FeedIndexRoute: typeof FeedIndexRoute
  UsersIndexRoute: typeof UsersIndexRoute
  ConnectionRequestIndexRoute: typeof ConnectionRequestIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  authLoginRoute: authLoginRoute,
  authRegisterRoute: authRegisterRoute,
  ChatRoomIdRoute: ChatRoomIdRoute,
  ConnectionUserIdRoute: ConnectionUserIdRoute,
  ProfileUserIdRoute: ProfileUserIdRoute,
  ChatIndexRoute: ChatIndexRoute,
  FeedIndexRoute: FeedIndexRoute,
  UsersIndexRoute: UsersIndexRoute,
  ConnectionRequestIndexRoute: ConnectionRequestIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/(auth)/login",
        "/(auth)/register",
        "/chat/$roomId",
        "/connection/$userId",
        "/profile/$userId",
        "/chat/",
        "/feed/",
        "/users/",
        "/connection/request/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/(auth)/login": {
      "filePath": "(auth)/login.tsx"
    },
    "/(auth)/register": {
      "filePath": "(auth)/register.tsx"
    },
    "/chat/$roomId": {
      "filePath": "chat/$roomId.tsx"
    },
    "/connection/$userId": {
      "filePath": "connection/$userId.tsx"
    },
    "/profile/$userId": {
      "filePath": "profile/$userId.tsx"
    },
    "/chat/": {
      "filePath": "chat/index.tsx"
    },
    "/feed/": {
      "filePath": "feed/index.tsx"
    },
    "/users/": {
      "filePath": "users/index.tsx"
    },
    "/connection/request/": {
      "filePath": "connection/request/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
