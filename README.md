# IsraFlight - Real-Time Flight Board

A real-time flight management system that shows live flight updates. Built with modern web technologies and clean architecture principles.

## What This Project Does

Think of this as a digital flight board you'd see at an airport, but it updates in real-time. When someone adds or deletes a flight, everyone sees the changes instantly. Flight statuses (Scheduled, Boarding, Departed, Landed) update automatically based on departure times.

## How ItsBuilt

### Backend (ASP.NET Core)

The backend is organized in layers, each with a specific job:

- **API Layer** (`FlightBoard.Api`): Handles HTTP requests and real-time connections
- **Application Layer** (`FlightBoard.Application`): Contains business logic and services
- **Domain Layer** (`FlightBoard.Domain`): Defines what a flight is and its rules
- **Infrastructure Layer** (`FlightBoard.Infrastructure`): Handles database operations

This separation makes the code easier to test and maintain.

### Frontend (React)

The frontend is built with React and uses several libraries to handle different concerns:

- **React**: For building the user interface
- **Material-UI**: For pre-built, beautiful components
- **Redux Toolkit**: We only use Redux to manage the filters' state (status, destination, search). We chose not to use Redux for form fields as it felt unnecessary - React's built-in state management works fine for that.
- **TanStack Query**: Handles fetching and caching flight data from the server
- **SignalR**: Connects to the backend for real-time updates
- **Framer Motion**: Adds smooth animations when flights are added, deleted, or their status changes

## Real-Time Features

The app uses WebSockets (via SignalR) to push updates instantly:

- When you add a flight, everyone sees it immediately
- When a flight's status changes (Scheduled → Boarding → Departed → Landed), it updates in real-time
- When you delete a flight, it disappears from everyone's screen

## Flight Status Logic

The system automatically calculates flight status based on departure time:

- **Scheduled**: More than30s before departure
- **Boarding**:30s before departure until departure time
- **Departed**: From departure time until 60minutes after
- **Landed**: More than 60 minutes after departure time

## Setup and Run Instructions

### Backend Setup

> **Note:** The database is automatically cleared and seeded with realistic flights to real destinations (e.g., "New York", "London") each time the backend starts. This ensures you always have demo data for testing.

1. **Navigate to the backend folder:**

```bash
cd backend/FlightBoard.Api
```

2. **Install dependencies:**
   ```bash
   dotnet restore
   ```
   3 **Run the API:**
   ```bash
   dotnet run
   ```
   The API will start at `http://localhost:50014un tests (optional):\*\*
   ```bash
   cd ../FlightBoard.Tests
   dotnet test
   ```

### Frontend Setup1 **Navigate to the frontend folder:**

```bash
cd frontend
```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## Architectural Choices

### Why Clean Architecture?

We separated the backend into layers because it makes the code easier to understand, test, and modify. Each layer has a specific responsibility, and changes in one layer dontbreak others.

### Why Redux Only for Filters?

We use Redux Toolkit to manage filter state (status, destination, search) because these filters affect the entire app and need to be shared between components. For form fields, React's built-in state is simpler and more appropriate.

### Why SignalR?

We chose SignalR (which uses WebSockets) for real-time updates because it provides a reliable, efficient way to push updates to all connected clients without polling the server constantly.

### Why SQLite?

We use SQLite for development because it's lightweight, requires no setup, and stores data in a file. Perfect for development and demos.

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
- **Redux Toolkit**: State management (filters only)
- **TanStack Query**: Server state management
- **SignalR Client**: Real-time communication
- **Framer Motion**: Animations
- **React Router**: Navigation (if needed)

## Prerequisites

- .NET 80 SDK
- Node.js 18
