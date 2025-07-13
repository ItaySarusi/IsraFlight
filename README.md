# IsraFlight

A real-time flight board management system with a modern React frontend and .NET backend.

## Project Structure

- `frontend/` - React TypeScript application with modern UI components
- `backend/` - .NET 8.0 Clean Architecture solution
  - `FlightBoard.Api` - REST API and SignalR hub
  - `FlightBoard.Application` - Application business logic
  - `FlightBoard.Domain` - Domain entities and interfaces
  - `FlightBoard.Infrastructure` - Data access and external services

## Features

- Real-time flight updates using SignalR
- Modern UI with neomorphism and glassmorphism design
- Flight status management
- Filtering and sorting capabilities
- Responsive layout

## Prerequisites

- Node.js 18+ and npm
- .NET 8.0 SDK
- SQLite

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend/FlightBoard.Api
   ```

2. Restore dependencies and run the API:
   ```bash
   dotnet restore
   dotnet run
   ```

The API will be available at `https://localhost:7001`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Technologies

### Frontend

- React with TypeScript
- Redux Toolkit for state management
- React Query for data fetching
- Tailwind CSS for styling
- SignalR client for real-time updates

### Backend

- ASP.NET Core 8.0
- Entity Framework Core
- SQLite database
- SignalR for real-time communication
- Clean Architecture pattern

## License

MIT
