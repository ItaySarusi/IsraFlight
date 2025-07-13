# IsraFlight - Real-Time Flight Board Management System

A professional, full-stack, real-time flight board management system built with modern development practices. The system features live-updating flight boards, comprehensive backend API for flight management, and a clean, user-friendly UI.

## 🎯 Project Overview

IsraFlight is a real-time flight management system that demonstrates clean architecture principles, test-driven development, and modern web technologies. The system provides live updates via SignalR, comprehensive flight management capabilities, and a responsive Material-UI frontend.

## 🏗️ Architecture

### Backend Architecture (Clean Architecture)

```
FlightBoard.Api/           # Presentation Layer (Controllers, Hubs)
FlightBoard.Application/   # Application Layer (Services, Interfaces)
FlightBoard.Domain/        # Domain Layer (Entities, Enums, Interfaces)
FlightBoard.Infrastructure/# Infrastructure Layer (Data, Repositories)
FlightBoard.Tests/         # Unit Tests (xUnit + Moq)
```

### Frontend Architecture

```
src/
├── components/           # React Components
├── services/            # API Services & SignalR
├── store/              # Redux Toolkit State Management
├── types/              # TypeScript Type Definitions
├── theme/              # Material-UI Theme Configuration
└── hooks/              # Custom React Hooks
```

## 🚀 Features

### Core Features

- ✅ **Real-Time Flight Board**: Live updates via SignalR
- ✅ **Flight Management**: Add, delete, and search flights
- ✅ **Server-Side Status Calculation**: Automatic status updates based on departure time
- ✅ **Advanced Filtering**: Filter by status, destination, and flight number
- ✅ **Responsive Design**: Material-UI with custom theme
- ✅ **Connection Management**: Real-time connection status with retry functionality

### Flight Status Logic

- **Scheduled**: More than 30 minutes before departure
- **Boarding**: 30 minutes before departure until departure time
- **Departed**: From departure time until 60 minutes after
- **Landed**: More than 60 minutes after departure time

## 🛠️ Technologies Used

### Backend

- **ASP.NET Core 8.0** - Web API framework
- **Entity Framework Core** - ORM with SQLite database
- **SignalR** - Real-time communication
- **xUnit + Moq** - Unit testing and mocking
- **Clean Architecture** - Domain-driven design principles

### Frontend

- **React 18** - UI library with TypeScript
- **Material-UI (MUI)** - Component library and theming
- **Redux Toolkit** - State management
- **TanStack Query (React Query)** - Server state management
- **SignalR Client** - Real-time communication
- **Framer Motion** - Animations

### Development Tools

- **TypeScript** - Type-safe JavaScript
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

- .NET 8.0 SDK
- Node.js 18+ and npm
- Git

## 🚀 Setup Instructions

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd IsraFlight/backend
   ```

2. **Restore dependencies**

   ```bash
   dotnet restore
   ```

3. **Run the API**

   ```bash
   cd FlightBoard.Api
   dotnet run
   ```

   The API will be available at `http://localhost:5001`

4. **Run tests**
   ```bash
   cd ../FlightBoard.Tests
   dotnet test
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## 📚 API Endpoints

### Flight Management

- `GET /api/flights` - Get all flights
- `POST /api/flights` - Create a new flight
- `DELETE /api/flights/{id}` - Delete a flight
- `GET /api/flights/search` - Search flights with filters

### Real-Time Communication

- `POST /flightHub/negotiate` - SignalR negotiation endpoint
- WebSocket connection for real-time updates

## 🧪 Testing

### Test-Driven Development (TDD) Approach

The project follows TDD principles with comprehensive unit tests covering:

1. **Flight Status Calculation Tests**

   - Tests all status transition scenarios
   - Validates time-based logic
   - Ensures proper local time handling

2. **Flight Service Tests**
   - Business logic validation
   - Error handling scenarios
   - Repository interaction testing

### Running Tests

```bash
cd backend/FlightBoard.Tests
dotnet test
```

## 🎨 UI Features

### Material-UI Theme

- Custom color palette (orange, gray, black, blueish tones)
- Responsive design with breakpoints
- Consistent spacing and typography

### Animations

- Framer Motion for smooth transitions
- Loading states and hover effects
- Status change animations

### Real-Time Features

- Live connection status indicator
- Manual refresh button
- Automatic status updates

## 🔧 Configuration

### Backend Configuration

- SQLite database (in-memory for development)
- CORS configured for frontend communication
- SignalR with automatic reconnection

### Frontend Configuration

- API base URL: `http://localhost:5001`
- SignalR hub URL: `http://localhost:5001/flightHub`
- React Query caching and invalidation

## 📦 Third-Party Libraries

### Backend Dependencies

- `Microsoft.AspNetCore.SignalR` - Real-time communication
- `Microsoft.EntityFrameworkCore.Sqlite` - SQLite database provider
- `Microsoft.EntityFrameworkCore.Design` - EF Core design-time tools
- `Swashbuckle.AspNetCore` - API documentation
- `FluentValidation.AspNetCore` - Server-side validation
- `Serilog.AspNetCore` - Structured logging
- `xunit` - Unit testing framework
- `Moq` - Mocking framework

### Frontend Dependencies

- `@mui/material` - Material-UI components
- `@mui/icons-material` - Material icons
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React Redux bindings
- `@tanstack/react-query` - Server state management
- `@microsoft/signalr` - SignalR client
- `framer-motion` - Animation library
- `react-router-dom` - Routing (if needed)

## 🏛️ Architectural Decisions

### Clean Architecture

- **Separation of Concerns**: Each layer has a specific responsibility
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Testability**: Business logic is isolated and easily testable

### State Management

- **Redux Toolkit**: For client-side state (filters, connection status)
- **TanStack Query**: For server state (flight data, caching)
- **SignalR**: For real-time updates

### Database Design

- **SQLite**: Lightweight, file-based database for development
- **Entity Framework Core**: ORM with code-first approach
- **Migrations**: Database schema versioning

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build and run the entire stack
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop the services
docker-compose down
```

### Manual Backend Deployment

1. Build the application: `dotnet publish -c Release`
2. Deploy to your preferred hosting platform
3. Configure environment variables for production

### Manual Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting platform
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- [x] Docker containerization
- [x] Structured logging with Serilog
- [x] FluentValidation for enhanced validation
- [ ] Integration tests
- [ ] Performance monitoring
- [ ] User authentication and authorization
- [ ] Flight scheduling and recurring flights
- [ ] Email notifications for status changes
