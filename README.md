# IsraFlight

### Backend (ASP.NET Core)

The backend is organized in layers, each with a specific job:

- **API Layer** (`FlightBoard.Api`): Handles HTTP requests and real-time connections
- **Application Layer** (`FlightBoard.Application`): Contains business logic and services
- **Domain Layer** (`FlightBoard.Domain`): Defines what a flight is and its rules
- **Infrastructure Layer** (`FlightBoard.Infrastructure`): Handles database operations

The separation makes the code easier to test and maintain (Clean Architecture)

### Frontend (React)

The frontend is built with React and uses several libraries to handle different concerns:

- **React**: For building the user interface.
- **Material-UI**: For pre-built, beautiful components.
- **Redux Toolkit**: I only used Redux to manage the filters' state (status, destination, search).
  I Chose not to use Redux for form fields as it felt unnecessary. React's built-in state management works fine for that.
- **TanStack Query**: Handles fetching and caching flight data from the server.
- **SignalR**: Connects to the backend for real-time updates, makes sure all connected clients receive the changes immediately.
- **Framer Motion**: Adds smooth animations when flights are added, deleted, or their status changes.

## Real-Time Features

The app uses WebSockets (via SignalR) to push updates instantly:

- When you add a flight, everyone sees it immediately.
- When a flight's status changes (Scheduled → Boarding → Departed → Landed), it updates in real-time.
- When you delete a flight, it disappears from everyone's screen.

## Flight Status Logic

The system automatically calculates flight status based on departure time:

- **Scheduled**: More than 30s before departure.
- **Boarding**: 30s before departure until departure time.
- **Departed**: From departure time until 60 minutes after.
- **Landed**: More than 60 minutes after departure time.

## Setup and Run Instructions

### Backend Setup

> **Note:** The database is automatically cleared and seeded with realistic flights to real destinations (e.g., "New York", "London") each time the backend starts. This ensures you always have demo data for testing.

1. **Navigate to the backend folder:**
   cd backend/FlightBoard.Api

2. **Install dependencies:**
   dotnet restore

3. **Run the API:**
   dotnet run

   The API will start at `http://localhost:5001

4. **tests (optional):**
   cd ../FlightBoard.Tests
   dotnet test

### Frontend Setup

1. **Navigate to the frontend folder:**
   cd frontend

2. **Install dependencies:**
   npm install

3. **Start the development server:**
   npm start

   The app will open at `http://localhost:3000`

## Third-Party Libraries Used

### Backend Libraries

- **ASP.NET Core 8.0**: Web framework
- **Entity Framework Core**: Database operations
- **SignalR**: Real-time communication
- **SQLite**: Database
- **xUnit + Moq**: Testing
- **FluentValidation**: Input validation
- **Serilog**: Logging

### Frontend Libraries

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Material-UI (MUI)**: UI components
- **Redux Toolkit**: State management
- **TanStack Query**: Server state management
- **SignalR Client**: Real-time communication
- **Framer Motion**: Animations

## Prerequisites

- .NET 80 SDK
- Node.js 18
