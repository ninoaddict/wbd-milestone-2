# LinkedPurry

LinkedPurry is a LinkedIn-like social networking platform built as part of the Web Backend Development (WBD) course milestone project. It provides a comprehensive platform for professional networking, real-time communication, and content sharing.

## Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Real-time**: Socket.io for chat and live features
- **Authentication**: JWT with HTTP-only cookies
- **Security**: Rate limiting (express-rate-limit), input validation (Zod)
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React with TypeScript
- **Routing**: TanStack Router (file-based routing)
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI primitives with Tailwind CSS
- **Build Tool**: Vite
- **Notifications**: Web Push API for browser notifications

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Development**: Docker Compose for local development environment
- **Load Testing**: K6 for performance testing
- **Database Management**: Prisma migrations and seeding

## Features

### Core Features
- **User Authentication**: Secure login/registration with JWT tokens
- **User Profiles**: Create and manage professional profiles with images
- **Professional Networking**: Send/receive connection requests
- **Real-time Chat**: Private messaging with typing indicators
- **Feed System**: Post updates and view timeline
- **Notifications**: Browser push notifications for new messages and connections
- **Rate Limiting**: Protection against abuse with configurable limits

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Socket.io integration for live chat and notifications
- **File Uploads**: Profile image storage and serving
- **Database Indexing**: Optimized queries with strategic indexes
- **Error Handling**: Comprehensive error management with custom error classes
- **API Documentation**: Auto-generated Swagger docs

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development without Docker)
- PostgreSQL 15+ (if running without Docker)

### Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>
cd wbd-milestone-2

# Start all services (backend, frontend, database, redis)
docker compose -f docker-compose.dev.yml up

# Access the application:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# API Documentation: http://localhost:3000/api-docs
```

### Local Development Setup

#### Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run start:nodemon
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Database Operations
```bash
# In backend directory
npx prisma studio       # Open database GUI
npx prisma seed         # Run seed data
npx prisma migrate dev  # Apply migrations
```

## Development Commands

### Backend
```bash
npm run start:nodemon    # Hot reload development server
npm run build           # TypeScript compilation
npm run typecheck       # TypeScript checking
```

### Frontend
```bash
npm run dev             # Vite development server
npm run build           # Production build
npm run typecheck       # TypeScript checking
```

### Docker Operations
```bash
docker compose up                    # Production containers
docker compose -f docker-compose.dev.yml up  # Development with volumes
docker compose down -v              # Remove containers and volumes
```

### Testing
```bash
cd tests
npm run test:profile  # Profile endpoint load test
npm run test:feed     # Feed endpoint load test
```

## Project Structure

```
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/  # HTTP request handlers
│   │   ├── services/     # Business logic layer
│   │   ├── repositories/ # Data access layer (Prisma)
│   │   ├── socket/       # Real-time event handlers
│   │   ├── middlewares/  # Express middlewares
│   │   └── config/       # Configuration files
│   ├── prisma/           # Database schema and migrations
│   └── storage/          # File uploads
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── routes/       # Page components (TanStack Router)
│   │   ├── services/     # API client and socket integration
│   │   └── context/      # React context providers
│   └── public/           # Static assets
├── tests/                # Load testing with K6
└── docker-compose.*.yml  # Docker configurations
```

## API Documentation

The backend provides comprehensive API documentation via Swagger UI, accessible at `http://localhost:3000/api-docs` when running locally.

Key endpoints include:
- `/api/auth/*` - Authentication (login, register, logout)
- `/api/users/*` - User management and profiles
- `/api/connections/*` - Professional networking
- `/api/chat/*` - Messaging functionality
- `/api/feed/*` - Timeline and posts
- `/api/notifications/*` - Push notification management

## Security Features

- **Rate Limiting**: Multiple tiers (general, auth, content) with configurable limits
- **Input Validation**: Zod schemas for all API inputs
- **Authentication**: JWT tokens in HTTP-only cookies
- **CORS**: Configured for cross-origin requests
- **Trust Proxy**: Enabled for accurate IP detection behind reverse proxies
- **Error Handling**: Secure error responses without sensitive information

## Future Improvement

### Planned Features
- **Advanced Search**: Full-text search across profiles and posts
- **Groups/Communities**: Create and join professional groups
- **Job Postings**: Job board with applications and tracking
- **Analytics Dashboard**: User engagement metrics and insights
- **Mobile App**: React Native companion app
- **Video Calls**: WebRTC integration for video conferencing
- **Advanced Notifications**: Email notifications and advanced filtering
- **Content Moderation**: AI-powered content filtering and reporting

### Technical Improvements
- **Microservices Architecture**: Split monolithic backend into services
- **GraphQL API**: More flexible data fetching
- **CDN Integration**: Global content delivery for media files
- **Advanced Caching**: Multi-level caching strategy (Redis + CDN)
- **Monitoring**: Application performance monitoring and alerting
- **CI/CD Pipeline**: Automated testing and deployment
- **Database Sharding**: Horizontal scaling for user data
- **Advanced Security**: OAuth integration, 2FA, audit logging

### Performance Optimizations
- **Database Query Optimization**: Advanced indexing and query planning
- **Caching Strategy**: Intelligent cache invalidation and prefetching
- **Image Optimization**: Automatic resizing and WebP conversion
- **Lazy Loading**: Progressive loading of content and images
- **Service Worker**: Offline functionality and background sync

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of an educational course and is not licensed for commercial use.

## Acknowledgments

- Built as part of the Web Backend Development course
- Inspired by LinkedIn's professional networking platform
- Uses modern web technologies and best practices for scalable applications