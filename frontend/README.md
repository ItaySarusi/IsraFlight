# IsraFlight Frontend

A modern React TypeScript application for flight board management with neomorphism and glassmorphism styling.

## 🚀 Features Built

### ✅ Core Components

1. **Header Component** - Professional ISRAFLIGHT branding with gradient text and neomorphism styling
2. **Actions Component** - Control panel with:
   - Connection status indicator (red/green circle)
   - Add Flight button
   - Status filter dropdown
   - Destination filter dropdown
   - Search input field
   - Clear Filters button
3. **Flight Board Component** - Displays flights in a responsive table with:
   - Flight Number, Destination, Departure Time, Gate, Status columns
   - Color-coded status indicators
   - Delete functionality for each flight
   - Loading and error states
4. **Add Flight Modal** - Form for creating new flights with:
   - Client-side validation
   - React Portal implementation
   - Glassmorphism styling
   - Form fields: Flight Number, Destination, Departure Time, Gate

### 🎨 Styling Features

- **Neomorphism**: Soft, inset/outset shadows for cards and buttons
- **Glassmorphism**: Transparent, blurred backgrounds with glass-like effects
- **Color Scheme**: Orange, gray, black, and blue tones as requested
- **Animations**: Smooth transitions, hover effects, and loading states
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS

### 🔧 Technical Implementation

- **React + TypeScript**: Full type safety
- **TanStack Query (React Query)**: Server state management
- **Redux Toolkit**: Client-side state management (prepared but simplified for demo)
- **Tailwind CSS**: Utility-first styling with custom components
- **Axios**: HTTP client for API calls
- **React Portal**: Modal implementation

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # ISRAFLIGHT branding header
│   ├── ActionsSimple.tsx       # Control panel (simplified version)
│   ├── FlightBoard.tsx         # Flight display table
│   └── AddFlightModal.tsx      # Add flight form modal
├── hooks/
│   └── useFlights.ts           # React Query hooks
├── services/
│   └── api.ts                  # API service functions
├── store/
│   ├── index.ts                # Redux store configuration
│   ├── hooks.ts                # Typed Redux hooks
│   └── slices/                 # Redux slices
├── types/
│   └── flight.ts               # TypeScript interfaces
└── index.css                   # Tailwind CSS with custom styles
```

## 🎯 API Integration Ready

The application is configured to connect to the backend API at `http://localhost:5000` with the following endpoints:

- `GET /api/flights` - Get all flights
- `POST /api/flights` - Create new flight
- `DELETE /api/flights/{id}` - Delete flight
- `GET /api/flights/search` - Search flights with filters

## 🔮 Features Ready for Enhancement

1. **SignalR Integration**: Connection status component ready for real-time updates
2. **Redux Filters**: Full filter state management prepared
3. **Search Functionality**: Client-side and server-side search ready
4. **Optimistic Updates**: React Query configured for immediate UI updates
5. **Error Handling**: Comprehensive error states and validation

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000
```

## 🎨 Custom Tailwind Classes

- `.neo-card` - Neomorphism card styling
- `.neo-inset` - Inset neomorphism effect
- `.glass-card` - Glassmorphism card
- `.glass-button` - Glassmorphism button
- `.btn-primary` - Primary button with gradient
- `.btn-secondary` - Secondary button styling
- `.input-field` - Glass-style input fields
- `.dropdown` - Glass-style dropdown menus
- `.status-indicator` - Animated status circles

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first approach
- Flexible grid layouts
- Adaptive component sizing
- Touch-friendly interactions

## 🔧 Next Steps

1. Connect to backend API
2. Implement SignalR for real-time updates
3. Add comprehensive error handling
4. Implement advanced filtering
5. Add animations for flight status changes
6. Add unit tests
7. Optimize performance
