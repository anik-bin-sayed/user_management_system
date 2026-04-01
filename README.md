# User Management System

A comprehensive, full-stack user management platform built with Django REST Framework and React that provides authentication, user profiles, professional development tracking, media management, and social media integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Migrations](#database-migrations)
- [Troubleshooting](#troubleshooting)

---

## Overview

This project is a complete user management system with separate backend and frontend applications. It allows users to create accounts, manage profiles, upload media, track professional skills and experience, and connect with social media platforms.

### Architecture

```
User Management System (Full Stack)
├── Backend (Django REST Framework)
│   └── RESTful API endpoints for authentication, profiles, and user management
└── Frontend (React + Vite)
    └── Modern React UI with Redux state management
```

---

## Key Features

### 🔐 Authentication & Security

- **Email-based Authentication**: Custom user model with email as primary identifier
- **OAuth Integration**: Google OAuth support via django-allauth
- **JWT Authentication**: Secure token-based authentication with automatic refresh
- **Email Verification**: Email verification tokens during signup
- **Two-Factor Authentication**: TOTP-based 2FA for enhanced security
- **Token Blacklisting**: Secure logout with token invalidation
- **Password Management**: Password change, forgot password, and secure reset functionality

### 👤 User Profile Management

- **Comprehensive Profiles**: Full user profile management with bio and contact information
- **Personal Information**: Store birthdate, gender, marital status, and preferences
- **Professional Information**: Track job title, company, industry, employment type, and years of experience
- **Skills Management**: Add, update, and manage professional skills
- **Education History**: Track educational background and institutions
- **Social Links**: Connect LinkedIn, GitHub, Twitter, and portfolio links

### 🖼️ Media Management

- **Image Upload**: Upload and manage user photos with Cloudinary integration
- **Gallery Management**: Browse uploaded images in an organized grid layout
- **Profile Pictures**: Set and manage current profile picture
- **Image History**: Full upload history tracking with timestamps
- **Cloud Storage**: Reliable cloud storage via Cloudinary

### 📊 Professional Development

- **Project Tracking**: Store and manage professional projects with descriptions
- **Employment Types**: Support Full-time, Part-time, Contract, Freelance, and Internship roles
- **Availability Status**: Indicate availability for work opportunities
- **Experience Tracking**: Detailed experience history by company and role

### ⚙️ User Preferences & Settings

- **Language Preferences**: Multi-language support
- **Timezone Settings**: Store user timezone for accurate scheduling
- **Dark Mode Toggle**: User preference for dark mode
- **Notification Preferences**: Control notification settings
- **Account Management**: Change password, enable/disable 2FA, delete account
- **Session Management**: Secure login/logout with token management

### 🎯 Frontend Features

- **Protected Routes**: Automatic authentication-based routing
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS
- **Real-time Validation**: Instant form validation feedback
- **Toast Notifications**: User-friendly success/error messages
- **State Management**: Redux Toolkit for global state management
- **Lazy Loading**: Code splitting for optimized performance
- **Modal Dialogs**: Confirmation modals for critical actions

---

## Tech Stack

### Backend

| Technology                    | Version | Purpose                |
| ----------------------------- | ------- | ---------------------- |
| Python                        | 3.10+   | Runtime environment    |
| Django                        | 6.0.3   | Web framework          |
| Django REST Framework         | 3.17.1  | API framework          |
| django-allauth                | 65.15.0 | OAuth & authentication |
| djangorestframework-simplejwt | 5.5.1   | JWT tokens             |
| social-auth-app-django        | 5.7.0   | Social authentication  |
| Cloudinary                    | 1.44.1  | Image storage          |
| django-cloudinary-storage     | 0.3.0   | Django integration     |
| django-cors-headers           | 4.9.0   | CORS support           |
| Pillow                        | 11.2.0  | Image processing       |

### Frontend

| Technology      | Version | Purpose                 |
| --------------- | ------- | ----------------------- |
| React           | 19.2.0  | UI framework            |
| Vite            | 7.3.1   | Build tool & dev server |
| Redux Toolkit   | 2.11.2  | State management        |
| React Router    | 7.13.1  | Client-side routing     |
| Tailwind CSS    | 4.2.1   | Utility-first CSS       |
| React Hook Form | 7.71.2  | Form management         |
| RTK Query       | Latest  | Data fetching & caching |
| React Toastify  | 11.0.5  | Notifications           |
| Heroicons       | 2.2.0   | SVG icons               |

---

## Project Structure

```
user-management/
├── backend/                          # Django REST API
│   ├── manage.py                    # Django management script
│   ├── requirements.txt             # Python dependencies
│   ├── README.md                    # Backend documentation
│   ├── accounts/                    # Authentication app
│   │   ├── models.py               # User models
│   │   ├── views.py                # API views
│   │   ├── serializers.py          # DRF serializers
│   │   ├── authentication.py       # Custom auth classes
│   │   ├── oauth_view.py           # OAuth handlers
│   │   └── migrations/             # Database migrations
│   ├── userprofile/                 # User profile app
│   │   ├── models/                 # Profile models (user_profile.py, professional.py, media.py)
│   │   ├── serializers/            # Serializers for profiles
│   │   ├── views.py                # Profile API views
│   │   ├── urls.py                 # API routes
│   │   └── migrations/             # Database migrations
│   └── user_management/             # Django settings
│       ├── settings.py             # Configuration
│       ├── urls.py                 # Root URL routing
│       └── wsgi.py                 # WSGI config
│
├── frontend/                         # React App
│   ├── package.json                # Dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── eslint.config.js            # Linting rules
│   ├── README.md                   # Frontend documentation
│   ├── index.html                  # HTML entry point
│   └── src/
│       ├── App.jsx                 # Main component
│       ├── main.jsx                # Entry point
│       ├── Components/             # Reusable components
│       │   ├── DetailsNavbar.jsx  # Navigation
│       │   ├── Footer.jsx         # Footer
│       │   ├── Home/              # Dashboard
│       │   ├── Media/             # Media gallery
│       │   ├── Settings/          # Settings
│       │   └── ShowAllDetails/    # Profile display
│       ├── Pages/                 # Page routes
│       │   └── Auth/              # Authentication pages
│       ├── Features/              # Redux slices & API
│       │   ├── auth/              # Auth API & state
│       │   └── user/              # User API & state
│       ├── Route/                 # Route configuration
│       └── utils/                 # Helper functions
│
└── README.md                         # This file (Project overview)
```

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Global Requirements

- **Git**: https://git-scm.com/
- **Node.js & npm**: https://nodejs.org/ (v18 or higher)
- **Python**: https://www.python.org/downloads/ (v3.10 or higher)

### External Services (Optional but Recommended)

- **Cloudinary Account**: https://cloudinary.com/ (for image storage)
- **Google OAuth Credentials**: https://console.cloud.google.com/ (for social login)
- **Gmail Account**: For email verification (optional, uses email backend)

### Python Tools

```bash
pip install virtualenv  # For isolated Python environments
```

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd user-management
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend

```bash
cd backend
```

#### 2.2 Create Virtual Environment

**On Windows:**

```bash
python -m venv venv
.\venv\Scripts\activate
```

**On macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

#### 2.4 Create Environment File

Create a `.env` file in the `backend` directory:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (uses SQLite by default)
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Cloudinary (optional, for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OAuth (optional, for Google login)
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-google-client-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### 2.5 Run Migrations

```bash
python manage.py migrate
```

#### 2.6 Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

#### 2.7 Start Backend Server

```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

Admin panel: `http://localhost:8000/admin`

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend

```bash
cd ../frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

#### 3.3 Create Environment File

Create a `.env.local` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

#### 3.4 Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## Configuration

### Backend Configuration

All backend configuration is in `user_management/settings.py` and `.env` file.

#### Key Settings

| Setting                | Purpose                | Production Value        |
| ---------------------- | ---------------------- | ----------------------- |
| `DEBUG`                | Enable debug mode      | `False`                 |
| `SECRET_KEY`           | Django secret key      | Generate new secure key |
| `ALLOWED_HOSTS`        | Allowed domain names   | Your domain names       |
| `DATABASES`            | Database configuration | PostgreSQL recommended  |
| `CORS_ALLOWED_ORIGINS` | CORS origins           | Your frontend domain    |

### Frontend Configuration

Configuration is in `.env.local` file. Key variables:

```env
VITE_API_URL=<backend-api-url>
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

---

## Running the Application

### Development Mode

#### Terminal 1: Backend

```bash
cd backend
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
python manage.py runserver
```

#### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

Access the application:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

### Production Build

#### Backend

```bash
# Use wsgi.py file with production server (gunicorn, uWSGI, etc.)
gunicorn user_management.wsgi --bind 0.0.0.0:8000
```

#### Frontend

```bash
# Build optimized production bundle
npm run build

# Output is in dist/ directory
# Serve with your web server (nginx, Apache, etc.)
```

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint                     | Description               |
| ------ | ---------------------------- | ------------------------- |
| POST   | `/api/auth/register/`        | User registration         |
| POST   | `/api/auth/login/`           | User login                |
| POST   | `/api/auth/verify-email/`    | Verify email address      |
| POST   | `/api/auth/logout/`          | User logout               |
| POST   | `/api/auth/refresh-token/`   | Refresh JWT token         |
| POST   | `/api/auth/forgot-password/` | Request password reset    |
| POST   | `/api/auth/reset-password/`  | Reset password with token |

### 2FA Endpoints

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| POST   | `/api/auth/setup-2fa/`   | Setup two-factor authentication |
| POST   | `/api/auth/verify-2fa/`  | Verify 2FA code during login    |
| POST   | `/api/auth/disable-2fa/` | Disable 2FA                     |

### Profile Endpoints

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/api/profile/`               | Get user profile         |
| PUT    | `/api/profile/`               | Update user profile      |
| POST   | `/api/profile/upload-image/`  | Upload profile image     |
| GET    | `/api/profile/image-history/` | Get image upload history |
| DELETE | `/api/profile/image/<id>/`    | Delete image             |

### Additional Endpoints

For detailed API documentation, see [backend/README.md](backend/README.md)

---

## Database Migrations

### Creating Migrations

When you modify models, create and apply migrations:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Viewing Migration Status

```bash
python manage.py showmigrations
```

### Reverting Migrations

```bash
# Revert to specific migration
python manage.py migrate accounts 0002

# Revert all migrations for an app
python manage.py migrate accounts zero
```

---

## Troubleshooting

### Backend Issues

#### 1. ModuleNotFoundError: No module named 'django'

**Solution**: Activate virtual environment and reinstall dependencies

```bash
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

#### 2. "Address already in use" error

**Solution**: Port is already in use. Use different port:

```bash
python manage.py runserver 8001
```

#### 3. Database migration errors

**Solution**: Reset migrations

```bash
# Delete db.sqlite3 (loses all data)
rm db.sqlite3
python manage.py migrate
```

#### 4. CORS errors in frontend

**Solution**: Ensure frontend URL is in CORS_ALLOWED_ORIGINS

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

### Frontend Issues

#### 1. npm ERR! missing: jsbi

**Solution**: Clear node_modules and reinstall

```bash
rm -rf node_modules package-lock.json  # Windows: rmdir /s node_modules && del package-lock.json
npm install
```

#### 2. "Cannot find module" errors

**Solution**: Check import paths and reinstall

```bash
npm install
npm run dev
```

#### 3. API requests returning 401 Unauthorized

**Solution**: Check JWT token:

- Verify backend is running
- Check .env.local has correct API URL
- Clear browser cookies and login again

#### 4. Images not uploading

**Solution**: Check Cloudinary credentials

- Verify CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET in .env
- Check Cloudinary account is active
- Ensure backend has admin privileges

### Common Issues

| Issue                | Cause                               | Solution                                                |
| -------------------- | ----------------------------------- | ------------------------------------------------------- |
| CORS errors          | Frontend URL not in allowed origins | Add frontend URL to CORS_ALLOWED_ORIGINS in settings.py |
| Email not sending    | Email credentials incorrect         | Verify EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env  |
| Images not uploading | Cloudinary not configured           | Set CLOUDINARY\_\* variables in .env                    |
| Login fails          | JWT token expired                   | Refresh token endpoint will auto-refresh                |
| 404 on API calls     | API not running or wrong URL        | Check backend is running on correct port                |

---

## Performance & Security Notes

### In Development

- `DEBUG=True` - Provides detailed error pages
- SQLite database - Fine for development
- Allow CORS from localhost

### Before Production

- Set `DEBUG=False`
- Use strong `SECRET_KEY`
- Switch to PostgreSQL or MySQL
- Configure proper email backend
- Set up HTTPS/SSL
- Implement rate limiting
- Use environment-specific settings
- Configure proper logging
- Set up monitoring and alerts
- Use secure password hashing
- Implement CSRF protection
- Enable HTTPS redirects

---

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Support & Contributing

For issues, questions, or contributions, please:

1. Check existing documentation
2. Review troubleshooting section
3. Create an issue with detailed information
4. Follow contribution guidelines

---

## License

[Specify your license here]

---

**Project Status**: ✅ Active Development

**Last Updated**: April 2026

**Maintainers**: [Your Team]
