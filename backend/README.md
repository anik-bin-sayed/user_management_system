# User Management Backend

A comprehensive user management system built with Django and Django REST Framework (DRF) that provides authentication, user profiles, professional development tracking, and social media integration.

## 🎯 Features

### Authentication & Security

- **Email-based Authentication**: Custom user model with email as primary identifier
- **OAuth Integration**: Google OAuth support via django-allauth
- **JWT Authentication**: Token-based authentication using SimpleJWT
- **Email Verification**: Email verification tokens and OTP login support
- **Token Blacklisting**: Secure logout with token blacklisting

### User Management

- **User Profiles**: Comprehensive user profile with bio, contact information, and preferences
- **Profile Customization**: Support for personal details including:
  - Birthdate, gender, marital status
  - Language and timezone preferences
  - Dark mode toggle
  - Notification preferences
  - Social media links (LinkedIn, GitHub, Twitter, Portfolio)

### Professional Development

- **Professional Information**: Track job title, company, industry, and years of experience
- **Employment Types**: Support for Full-time, Part-time, Contract, Freelance, and Internship roles
- **Skills Management**: Add and manage professional skills
- **Education History**: Track educational background and institutions
- **Availability Status**: Mark availability for work opportunities

### Project & Media Management

- **Project Tracking**: Store and manage projects with descriptions and links
- **Media Storage**: Upload and manage user photos using Cloudinary
- **Profile Pictures**: Set current profile picture from uploaded images

### Additional Features

- **CORS Support**: Cross-Origin Resource Sharing enabled for frontend integration
- **Cloud Storage**: Cloudinary integration for reliable image storage
- **RESTful API**: Fully featured REST API with DRF
- **Django Admin**: Admin interface for user management

## 🛠️ Tech Stack

- **Python**: 3.10+
- **Django**: 6.0.3
- **Django REST Framework**: 3.17.1
- **Authentication**:
  - django-allauth: 65.15.0
  - djangorestframework_simplejwt: 5.5.1
  - social-auth-app-django: 5.7.0
- **Storage**:
  - Cloudinary: 1.44.1
  - django-cloudinary-storage: 0.3.0
- **Utilities**:
  - django-cors-headers: 4.9.0
  - python-decouple: 3.8
  - Pillow: 11.2.0

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10 or higher**
- **pip** (Python package manager)
- **Git** (for version control)
- **virtualenv** (recommended for isolated Python environments)
- **Cloudinary Account** (for image storage): https://cloudinary.com/
- **Google OAuth Credentials** (optional, for social authentication)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone git@github.com:anik-bin-sayed/user_management_system_backend.git
cd user-management/backend
```

### Step 2: Create a Virtual Environment

**On Windows (PowerShell/CMD):**

```bash
python -m venv venv
.\venv\Scripts\activate
```

**On macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (if using PostgreSQL)
DB_NAME=user_management
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Cloudinary Settings
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth (Optional)
GOOGLE_OAUTH_CLIENT_ID=your-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret

# Email Configuration (Optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Step 5: Apply Database Migrations

```bash
python manage.py migrate
```

### Step 6: Create a Superuser Account

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account with:

- Email
- Password
- Confirm Password

### Step 7: Run the Development Server

```bash
python manage.py runserver
```

The server will start at `http://127.0.0.1:8000/`

## 📁 Project Structure

```
backend/
├── accounts/                          # User authentication module
│   ├── models.py                     # Custom User model and authentication tokens
│   ├── views.py                      # Authentication views and endpoints
│   ├── serializers.py                # User and authentication serializers
│   ├── urls.py                       # Auth API routes
│   ├── authentication.py             # Custom authentication backends
│   ├── adapter.py                    # OAuth adapters
│   ├── social_adapter.py             # Social authentication adapter
│   ├── signals.py                    # Django signals for user creation
│   └── migrations/                   # Database migrations
│
├── userprofile/                       # User profile management module
│   ├── models/
│   │   ├── user_profile.py           # UserProfile model
│   │   ├── professional.py           # Professional info, skills, education
│   │   └── media.py                  # User profile photos
│   ├── serializers/
│   │   ├── user_profile.py           # ProfileSerializer
│   │   ├── professional.py           # Professional data serializers
│   │   └── media.py                  # Media serializers
│   ├── views.py                      # Profile endpoints
│   ├── urls.py                       # Profile API routes
│   ├── utils/
│   │   └── paginator.py              # Pagination utilities
│   └── migrations/                   # Database migrations
│
├── user_management/                   # Project settings
│   ├── settings.py                   # Django settings
│   ├── urls.py                       # Main URL configuration
│   ├── wsgi.py                       # Production WSGI config
│   └── asgi.py                       # ASGI config
│
├── manage.py                          # Django management script
├── requirements.txt                   # Project dependencies
└── README.md                          # This file
```

## 🔌 API Endpoints Overview

### Authentication Endpoints

- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/email-verify/` - Verify email
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `POST /api/auth/otp-login/` - Login with OTP

### User Profile Endpoints

- `GET /api/profile/` - Get current user profile
- `PUT /api/profile/` - Update user profile
- `GET /api/profile/{id}/` - Get user profile by ID

### Professional Information Endpoints

- `GET /api/professional/` - Get professional info
- `PUT /api/professional/` - Update professional info
- `POST /api/professional/skills/` - Add skill
- `GET /api/professional/skills/` - List skills
- `POST /api/professional/education/` - Add education
- `GET /api/professional/education/` - List education history

### Media Endpoints

- `POST /api/media/upload/` - Upload profile photo
- `GET /api/media/photos/` - List user photos
- `PUT /api/media/{id}/set-current/` - Set current profile photo
- `DELETE /api/media/{id}/` - Delete photo

### OAuth Endpoints

- `GET /api/auth/google/` - Google OAuth authentication

## 📝 Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "securepassword123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Update User Profile

```bash
curl -X PUT http://localhost:8000/api/profile/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "bio": "Software Developer",
    "phone": "+1234567890",
    "city": "San Francisco",
    "github": "https://github.com/username"
  }'
```

## 🔐 Security Notes

- Always change the `SECRET_KEY` in production
- Set `DEBUG=False` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Configure ALLOWED_HOSTS with your domain
- Set up proper CORS policies for production
- Use secure password hashing (Django default: PBKDF2)

## 🧪 Running Tests

```bash
python manage.py test
```

Or for specific app:

```bash
python manage.py test accounts
python manage.py test userprofile
```

## 📦 Deployment

For production deployment:

1. Set `DEBUG=False` in settings.py or .env
2. Update `ALLOWED_HOSTS` with your domain
3. Configure a production database (PostgreSQL recommended)
4. Set up environment variables securely
5. Configure static files and media serving
6. Use a production WSGI server (Gunicorn, uWSGI, etc.)
7. Set up SSL/TLS certificates

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [django-allauth Documentation](https://django-allauth.readthedocs.io/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

Anik Bin Sayed - [GitHub]

---

**Last Updated**: March 2026
