# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# CareerLink Frontend

> An AI-powered campus placement management portal built with React.js

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Routing](#routing)
- [Styling](#styling)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

CareerLink Frontend is a modern, responsive Single Page Application (SPA) that provides an intuitive interface for managing campus placements. It serves four distinct user roles: **Students**, **Recruiters**, **Administrators**, and **Alumni**, each with tailored dashboards and functionalities.

**Live Demo:** [https://career-link-frontend-henna.vercel.app](https://career-link-frontend-henna.vercel.app)

## ✨ Features

### 🎓 Student Portal

- **Profile Management**: Complete profile with resume upload, skills, CGPA, branch
- **Job Discovery**: Browse approved job postings with advanced filters
- **One-Click Apply**: Instant application with automatic eligibility verification
- **ATS Score Viewing**: See compatibility scores for each application
- **Application Tracking**: Real-time status updates (Applied, Shortlisted, Selected, Rejected)
- **Real-Time Notifications**: Instant alerts for new jobs and status changes
- **Alumni Feed**: Access interview experiences and career guidance

### 💼 Recruiter Dashboard

- **Job Management**: Create, edit, and manage job postings
- **Application Review**: View applications with ATS compatibility scores
- **Auto-Shortlist**: Automatically select top 30% candidates based on ATS threshold
- **Bulk Operations**: Process 200+ applications simultaneously
- **Status Updates**: Update application status across recruitment stages
- **Analytics Dashboard**: View recruitment statistics and trends
- **Post Updates**: Share placement process updates with students

### 👨‍💼 Admin Console

- **User Management**: Approve recruiters and alumni, manage student accounts
- **Job Approval**: Review and approve job postings before publication
- **Comprehensive Analytics**: Branch-wise, company-wise placement statistics
- **Report Generation**: Export detailed reports with custom filters
- **Announcement System**: Post platform-wide announcements
- **Application Oversight**: Monitor and manage all application workflows

### 🎓 Alumni Network

- **Referral Posting**: Share job opportunities from their organizations
- **Experience Sharing**: Post interview tips and career guidance
- **Community Engagement**: Contribute to student feed with insights

### 🔔 Real-Time Features

- **WebSocket Notifications**: Instant updates via Socket.IO (<3 seconds delivery)
- **Browser Notifications**: Desktop notifications for important events
- **Sound Alerts**: Audio notifications for new updates
- **Unread Count Badge**: Visual indicator for pending notifications

## 🛠 Tech Stack

| Technology           | Purpose                 | Version |
| -------------------- | ----------------------- | ------- |
| **React**            | UI Library              | 18.2.0  |
| **Vite**             | Build Tool & Dev Server | 5.0+    |
| **React Router**     | Client-side Routing     | 6.x     |
| **Axios**            | HTTP Client             | 1.6+    |
| **Socket.IO Client** | Real-time Communication | 4.5+    |
| **Tailwind CSS**     | Utility-first Styling   | 3.3+    |
| **React Hot Toast**  | Toast Notifications     | 2.4+    |
| **date-fns**         | Date Formatting         | 2.30+   |
| **Recharts**         | Data Visualization      | 2.8+    |
| **Lucide React**     | Icon Library            | Latest  |

## 📦 Prerequisites

Before running this project, ensure you have:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))
- **Backend Server**: CareerLink backend running ([Backend Repo](https://github.com/yourusername/careerlink-backend))

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/ACS558/careerlink-frontend.git
cd careerlink-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration (see [Environment Variables](#environment-variables)).

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend API Configuration
VITE_API_URL=https://careerlink-backend-itv6.onrender.com/api
# For local development: http://localhost:5000/api

# Socket.IO Configuration
VITE_SOCKET_URL=https://careerlink-backend-itv6.onrender.com
# For local development: http://localhost:5000

# Application Configuration
VITE_APP_NAME=CareerLink
VITE_APP_VERSION=1.0.0
```

### Environment Variables Explanation

| Variable           | Description              | Example                          |
| ------------------ | ------------------------ | -------------------------------- |
| `VITE_API_URL`     | Backend API base URL     | `https://api.careerlink.com/api` |
| `VITE_SOCKET_URL`  | Socket.IO server URL     | `https://api.careerlink.com`     |
| `VITE_APP_NAME`    | Application display name | `CareerLink`                     |
| `VITE_APP_VERSION` | Current version          | `1.0.0`                          |

**⚠️ Important Notes:**

- All Vite environment variables must be prefixed with `VITE_`
- Never commit `.env` file to version control
- Use `.env.example` as a template for other developers

## 🏃 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Features in Development Mode:**

- Hot Module Replacement (HMR)
- Source maps for debugging
- React DevTools support
- Detailed error messages

### Production Build

Create an optimized production build:

```bash
npm run build
```

This generates optimized files in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

Fix auto-fixable linting errors:

```bash
npm run lint:fix
```

## 📁 Project Structure

```
careerlink-frontend/
├── public/                    # Static assets
│   ├── logo.png              # Application logo
│   ├── sounds/               # Notification sounds
│   │   └── notification.mp3
│   └── vite.svg
├── src/
│   ├── assets/               # Images, fonts, etc.
│   ├── components/           # React components
│   │   ├── common/          # Shared components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── student/         # Student-specific components
│   │   ├── recruiter/       # Recruiter-specific components
│   │   ├── admin/           # Admin-specific components
│   │   └── alumni/          # Alumni-specific components
│   ├── context/             # React Context for state management
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useNotifications.js
│   │   └── useWebSocket.js
│   ├── pages/               # Page components (route handlers)
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── RegisterStudent.jsx
│   │   │   ├── RegisterRecruiter.jsx
│   │   │   └── RegisterAlumni.jsx
│   │   ├── student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BrowseJobs.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   └── Profile.jsx
│   │   ├── recruiter/
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── ManageJobs.jsx
│   │   │   └── ViewApplications.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageStudents.jsx
│   │   │   ├── ApproveRecruiters.jsx
│   │   │   └── Analytics.jsx
│   │   └── alumni/
│   │       ├── AlumniDashboard.jsx
│   │       ├── PostReferral.jsx
│   │       └── ShareExperience.jsx
│   ├── services/            # API service layer
│   │   ├── api.js          # Axios instance & interceptors
│   │   ├── authService.js
│   │   ├── jobService.js
│   │   ├── applicationService.js
│   │   └── notificationService.js
│   ├── socket/              # Socket.IO configuration
│   │   └── socketClient.js
│   ├── utils/               # Utility functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles (Tailwind)
├── .env                      # Environment variables (not in git)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── index.html               # HTML entry point
├── package.json             # Dependencies & scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── vercel.json              # Vercel deployment config
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## 🧩 Key Components

### Authentication Flow

```jsx
// src/context/AuthContext.jsx
// Manages user authentication state across the application
// Provides login, logout, and user role management
```

### Real-Time Notifications

```jsx
// src/hooks/useNotifications.js
// Custom hook for managing notifications
// Features:
// - WebSocket connection via Socket.IO
// - Browser notification API integration
// - Sound alerts
// - Unread count tracking
```

### Protected Routes

```jsx
// src/components/common/ProtectedRoute.jsx
// Ensures only authenticated users with correct roles can access routes
```

### API Service Layer

```jsx
// src/services/api.js
// Centralized Axios configuration with:
// - Request/response interceptors
// - Automatic token attachment
// - Error handling
// - Base URL configuration
```

## 🔗 API Integration

### Axios Configuration

```javascript
// Base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

### Example API Calls

```javascript
// Authentication
await api.post("/auth/login", { email, password });
await api.post("/auth/register/student", userData);

// Jobs
await api.get("/jobs");
await api.post("/jobs", jobData);

// Applications
await api.post("/applications", { jobId });
await api.patch("/applications/bulk-update", { applicationIds, status });

// Notifications
await api.get("/notifications");
await api.put("/notifications/read-all");
```

## 🔄 State Management

CareerLink uses **React Context API** for global state management:

### Auth Context

```jsx
const { user, login, logout, isAuthenticated } = useAuth();
```

**Features:**

- User authentication state
- Login/logout functionality
- Role-based access control
- Token management

### Notification Context

```jsx
const { notifications, unreadCount, markAsRead, markAllAsRead } =
  useNotifications();
```

**Features:**

- Real-time notification updates via Socket.IO
- Unread count tracking
- Mark as read functionality
- Browser notification integration

## 🗺 Routing

React Router v6 is used for client-side routing with role-based access:

```jsx
// Public Routes
/login
/register/student
/register/recruiter
/register/alumni

// Student Routes (Protected)
/student/dashboard
/student/jobs
/student/applications
/student/profile

// Recruiter Routes (Protected)
/recruiter/dashboard
/recruiter/post-job
/recruiter/jobs
/recruiter/applications

// Admin Routes (Protected)
/admin/dashboard
/admin/students
/admin/recruiters
/admin/jobs
/admin/analytics

// Alumni Routes (Protected)
/alumni/dashboard
/alumni/referrals
/alumni/feed
```

## 🎨 Styling

### Tailwind CSS

CareerLink uses **Tailwind CSS** for styling with custom configuration:

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          // ... custom color palette
          600: "#0284c7",
          700: "#0369a1",
        },
      },
    },
  },
};
```

### Responsive Design

All components are fully responsive with Tailwind breakpoints:

- `sm:` - Small devices (640px+)
- `md:` - Medium devices (768px+)
- `lg:` - Large devices (1024px+)
- `xl:` - Extra large devices (1280px+)

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub:**

   ```bash
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Configure build settings (auto-detected)

3. **Environment Variables:**
   - Add all environment variables in Vercel dashboard
   - Settings → Environment Variables

4. **Deploy:**
   - Vercel auto-deploys on every push to main branch

### Manual Build & Deploy

```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting service
```

### Important: Vercel SPA Configuration

The `vercel.json` file ensures proper routing for SPA:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This prevents 404 errors on page refresh.

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot connect to backend"

**Problem:** Frontend can't reach the backend API

**Solutions:**

```bash
# Check if backend is running
curl https://careerlink-backend-itv6.onrender.com/api/health

# Verify VITE_API_URL in .env
# Make sure there's no trailing slash
VITE_API_URL=http://localhost:5000/api  # Correct
VITE_API_URL=http://localhost:5000/api/ # Wrong
```

#### 2. "WebSocket connection failed"

**Problem:** Real-time notifications not working

**Solutions:**

```bash
# Check VITE_SOCKET_URL (no /api path)
VITE_SOCKET_URL=http://localhost:5000  # Correct

# Check browser console for Socket.IO errors
# Ensure backend Socket.IO is running on same port
```

#### 3. "Page not found on refresh"

**Problem:** 404 error when refreshing page on Vercel

**Solution:**

```bash
# Ensure vercel.json exists with rewrites
# See deployment section above
```

#### 4. "Module not found" errors

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### 5. "Build fails on Vercel"

**Solution:**

```bash
# Check Node.js version in Vercel settings
# Should be 18.x or higher

# Ensure all environment variables are set in Vercel dashboard

# Check build logs for specific errors
```

## 📝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Commit with meaningful messages:**
   ```bash
   git commit -m "feat: add job filtering by location"
   ```
5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

### Code Style

- Follow existing code patterns
- Use meaningful variable/function names
- Add comments for complex logic
- Run linter before committing:
  ```bash
  npm run lint
  ```

### Commit Message Format

```
type(scope): subject

body

footer
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

**CareerLink Development Team**

- Sk. Mohammad Ali - (https://github.com/ACS558)
- M. Hema Bhuvaneswari
- V. Sravani
- S. Naga Goutham

**Guided by:**

- K. Arun Babu, M.Tech - Assistant Professor, CSE

## 🙏 Acknowledgments

- Department of Computer Science and Engineering, Bapatla Engineering College
- All faculty members and staff who supported this project
- The open-source community for the amazing tools and libraries

## 📞 Support

For support, email: support@careerlink.com or create an issue in the repository.

---

**Made with ❤️ by CareerLink Team**
