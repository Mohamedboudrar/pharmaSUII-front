# Pharmacy Patient UI

A modern React-based patient-facing interface for pharmacy management systems. This application allows patients to manage their prescriptions, find nearby pharmacies, and upload prescription documents.

## Features

- **Authentication System**: Secure login and registration for patients
- **Dashboard**: Overview of patient's prescription status and activity
- **Pharmacy Finder**: Interactive map-based pharmacy search using Leaflet
- **Prescription Management**: View, track, and manage prescriptions
- **Prescription Upload**: Upload prescription documents with drag-and-drop support
- **Protected Routes**: Authentication-based route protection
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5
- **Smooth Animations**: Enhanced UX with Framer Motion
- **Toast Notifications**: User feedback for actions and errors

## Tech Stack

- **Frontend Framework**: React 19.2.6
- **Build Tool**: Vite 8.0.12
- **Styling**: Bootstrap 5.3.8
- **Routing**: React Router DOM 7.15.1
- **Maps**: Leaflet 1.9.4 + React Leaflet 5.0.0
- **Icons**: Lucide React 1.16.0
- **Animations**: Framer Motion 12.40.0
- **HTTP Client**: Axios 1.16.1
- **Code Quality**: ESLint 10.3.0

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Backend API running on `http://localhost:8081`

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pharmacy-patient-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables (if needed)**
   - The API base URL is currently set to `http://localhost:8081` in `src/api/axios.js`
   - Modify this file if your backend runs on a different port or domain

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173` (or the URL shown in terminal)
   - The application will redirect to the login page


## Project Structure

```
pharmacy-patient-ui/
├── public/              # Static assets
├── src/
│   ├── api/            # API configuration and endpoints
│   ├── assets/         # Images and other assets
│   ├── components/     # Reusable components (Navbar, Toast, etc.)
│   ├── context/        # React context (AuthContext)
│   ├── layouts/        # Layout components (MainLayout)
│   ├── pages/          # Page components
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── PharmacyDetailsPage.jsx
│   │   ├── PrescriptionsPage.jsx
│   │   ├── PrescriptionDetailsPage.jsx
│   │   └── UploadPage.jsx
│   ├── routes/         # Route configuration
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Project dependencies
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## API Integration

The application communicates with a backend API using Axios. The API endpoints include:

- **Authentication**: `/api/v1/auth/login`, `/api/v1/patient/auth/register`
- **Prescriptions**: `/api/v1/patient/prescriptions` (GET, POST, PATCH)

Authentication is handled via JWT tokens stored in localStorage with automatic injection into request headers.


## Troubleshooting

- **API Connection Issues**: Ensure the backend API is running on `http://localhost:8081`
- **Map Not Displaying**: Check that Leaflet CSS is properly imported
- **Authentication Errors**: Clear localStorage and try logging in again
- **Build Errors**: Ensure all dependencies are installed with `npm install`

