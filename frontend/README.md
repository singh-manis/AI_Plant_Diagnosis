# AI Plant P - Frontend

A modern React application for plant care management with AI-powered features.

## Features

- 🌱 **Plant Management**: Add, edit, and track your plants
- 📝 **Care Diary**: Log plant care activities with photos
- ⏰ **Smart Reminders**: Set and manage care reminders
- 🤖 **AI Assistant**: Plant identification and health diagnosis
- 🌤️ **Weather Integration**: Get weather-based care recommendations
- 🔔 **Notifications**: Real-time notifications for plant care
- 📊 **Dashboard**: Overview of your plant collection and care schedule

## Tech Stack

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling and responsive design
- **Axios** - HTTP client for API communication
- **Heroicons** - Icon library
- **Context API** - State management

## Project Structure

```
src/
├── components/          # React components
│   ├── ai/             # AI assistant components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (Toast, etc.)
│   ├── diary/          # Diary management components
│   ├── layout/         # Layout components (Navbar)
│   ├── plants/         # Plant management components
│   ├── reminders/      # Reminder components
│   └── weather/        # Weather components
├── context/            # React Context providers
├── services/           # API services and utilities
└── App.js              # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Add your backend API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

5. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000` |

## Development Guidelines

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Add JSDoc comments for complex functions
- Keep components focused and reusable

### Component Structure

```jsx
import React from 'react';

/**
 * Component description
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */
const ComponentName = ({ prop1, prop2 }) => {
  // State and effects
  
  // Event handlers
  
  // Render
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### API Integration

- Use the centralized API service in `src/services/api.js`
- Handle loading states and errors consistently
- Use toast notifications for user feedback

### State Management

- Use React Context for global state (authentication)
- Use local state for component-specific data
- Consider using React Query for server state management in the future

## Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Environment Setup

Ensure all environment variables are properly configured for your production environment.

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## License

This project is part of the AI Plant P application.
