# LinkedPurry Copilot Instructions

## Architecture Overview

LinkedPurry is a LinkedIn-like platform built with:
- **Backend**: Node.js/Express with TypeScript, Prisma ORM, PostgreSQL, Redis, Socket.io
- **Frontend**: React with TypeScript, TanStack Router, React Query, Radix UI, Tailwind CSS
- **Real-time**: Socket.io for chat with typing indicators
- **Notifications**: Web Push API for browser notifications

### Key Components
- **Controllers**: Handle HTTP requests, implement `Controller` interface, use Swagger annotations
- **Services**: Business logic layer, handle caching with Redis, interact with repositories
- **Repositories**: Data access layer using Prisma ORM
- **Socket Events**: Real-time features with Zod validation and typed event handlers
- **Middleware**: Auth (JWT with cookies), validation (Zod), error handling

## Critical Developer Workflows

### Local Development Setup
```bash
# Start all services with hot reload
docker compose -f docker-compose.dev.yml up

# Backend runs on :3000, Frontend on :5173
# Database on :5433, Redis on :6379
```

### Database Operations
```bash
# In backend container/dev environment
npx prisma migrate dev  # Apply migrations
npx prisma generate     # Generate client
npx prisma studio       # Open database GUI
npx prisma seed         # Run seed script
```

### Testing
```bash
# Load testing with K6
cd tests
npm run test:profile  # Profile endpoint load test
npm run test:feed     # Feed endpoint load test
```

## Project-Specific Patterns

### Backend Patterns

**Controller Structure** (`src/controllers/`):
```typescript
class ExampleController implements Controller {
  public path = "";
  public router = Router();
  
  constructor() {
    this.initRoutes();
  }
  
  exampleMethod = async (req: Request): Promise<BaseResponse> => {
    // Business logic here
    return { body: data, message: "Success" };
  };
  
  private initRoutes() {
    this.router.get(`${this.path}/example`, handleRequest(this.exampleMethod));
  }
}
```

**Service Layer** (`src/services/`):
- Use repositories for data access
- Implement Redis caching for expensive operations
- Handle business logic and data transformation
- Convert BigInt to string for JSON responses

**Repository Pattern** (`src/repositories/`):
```typescript
class ExampleRepository {
  exampleQuery = async (params) => {
    return await prisma.example.findMany({
      where: { /* conditions */ },
      select: { /* fields */ }
    });
  };
}
```

**Socket Events** (`src/socket/events/`):
```typescript
export const exampleEvent = createEvent(
  {
    name: "example",
    input: z.object({ field: z.string() }),
    authRequired: true,
  },
  async ({ ctx, input }) => {
    // Event logic with ctx.prisma, ctx.io, ctx.client
    return result;
  }
);
```

**Error Handling**:
- Use custom error classes (`src/errors/`)
- `handleRequest` utility wraps controllers with try/catch
- Errors serialized to `{ message, error, success: false }`

**Validation**:
- Zod schemas in `src/domain/schema/`
- `validateRequest` middleware for Express routes
- Socket events validate input with Zod

### Frontend Patterns

**Routing** (`src/routes/`):
- File-based routing with TanStack Router
- Routes in `__root.tsx`, `(auth)/`, `chat/$roomId.tsx` format
- Context passed through router for auth/queryClient

**Data Fetching**:
```typescript
// React Query hooks
const { data, isLoading } = useQuery({
  queryKey: ["example", params],
  queryFn: () => api.get("/example").then(res => res.data),
});
```

**Auth Context** (`src/context/auth-context.tsx`):
- React Query for user fetching
- Loading states handled globally
- Socket connection managed based on auth state

**Socket Integration** (`src/services/socket.ts`):
- Typed events with `ServerToClientEvents`/`ClientToServerEvents`
- Callbacks for acknowledgments
- Rooms for chat functionality

**UI Components**:
- Radix UI primitives with Tailwind CSS
- Custom components in `src/components/ui/`
- Shadcn/ui pattern with `class-variance-authority`

### Database Schema Patterns

**BigInt Handling**:
- User IDs are `BigInt` in database
- Convert to string in API responses: `JSON.stringify(value, (_, v) => typeof v === "bigint" ? v.toString() : v)`

**Relationships**:
- Chat rooms use `firstUserId`/`secondUserId` pattern
- Connections are bidirectional with separate request/response states
- Push subscriptions stored per user endpoint

### Authentication Flow

**Backend**:
- JWT tokens stored in httpOnly cookies
- `AuthMiddleware` with multiple check methods:
  - `checkUser`: Requires valid token
  - `checkPublicUser`: Optional token, sets req.user if valid
  - `checkAuthUser`: For auth routes (login/register), ensures no existing session

**Frontend**:
- Axios with `withCredentials: true`
- Auth context manages user state
- Automatic socket connect/disconnect based on auth

### Real-time Features

**Chat System**:
- Socket.io rooms per chat conversation
- Typing indicators with debouncing
- Push notifications for offline users
- Message history with timestamps

**Connection States**:
- `disconnected`: No relationship
- `requested`: Sent connection request
- `requesting`: Received connection request
- `connected`: Mutual connection
- `self`: Current user

### Caching Strategy

**Redis Usage**:
- User lists cached for 60 seconds
- Reduces database load for frequent queries
- Cache invalidation on user changes (not implemented in current code)

### File Upload

**Profile Images**:
- Stored in `backend/storage/images/`
- Served statically via `/storage` route
- Multer middleware for handling uploads
- File paths stored in database

### Push Notifications

**Web Push Setup**:
- VAPID keys for authentication
- Subscriptions stored in `push_subscriptions` table
- Automatic cleanup of invalid subscriptions
- Payload includes title, body, and chat URL

## Common Gotchas

- **BigInt Serialization**: Always convert BigInt to string in JSON responses
- **Cookie Auth**: Use `withCredentials: true` in frontend requests
- **Socket Auth**: JWT extracted from cookies in socket middleware
- **Prisma Migrations**: Run in development before starting server
- **Docker Volumes**: Use named volumes for database persistence
- **Environment Variables**: Backend uses `.env`, frontend uses `VITE_` prefixed vars

## Development Commands Reference

```bash
# Backend development
npm run start:nodemon    # Hot reload with nodemon
npm run build           # TypeScript compilation
npx prisma studio       # Database GUI

# Frontend development  
npm run dev             # Vite dev server
npm run typecheck       # TypeScript checking
npm run build           # Production build

# Docker operations
docker compose up                    # Production containers
docker compose -f docker-compose.dev.yml up  # Development with volumes
docker compose down -v              # Remove containers and volumes

# Database operations
npx prisma migrate dev              # Apply migrations
npx prisma generate                 # Generate Prisma client
npx prisma db push                  # Push schema changes (dev only)
npx prisma seed                     # Run seed data
```

## API Documentation

- Swagger docs available at `http://localhost:3000/api-docs`
- All endpoints documented with JSDoc annotations
- Request/response schemas defined inline

## Testing Strategy

- Load testing with K6 for performance validation
- Tests simulate real user behavior (login, profile access)
- Thresholds set for response times and error rates
- Database seeded with test users for consistent testing
