# User Management Frontend

A comprehensive React + Vite application for user profile management with authentication, media gallery, and advanced security features.

## Features

### 🔐 Authentication System

- **User Registration**: Create new accounts with email verification
- **Email Verification**: Verify email addresses during registration
- **Login/Logout**: Secure login with session management
- **Two-Factor Authentication (2FA)**: Enhanced security with TOTP-based 2FA
- **Password Management**: Change password and forgot password functionality
- **Token Refresh**: Automatic JWT token refresh mechanism
- **OAuth Integration**: Google OAuth support for seamless login

### 👤 User Profile Management

- **Personal Information**: Manage full name, username, email, and other personal details
- **Professional Information**: Add work experience, skills, education, and job title
- **Contact Information**: Store phone numbers and contact details
- **Social Links**: Add links to social media profiles
- **Profile Picture**: Upload and manage profile pictures with preview modal
- **Account Preferences**: User-specific preferences and settings

### 🖼️ Media Gallery

- **Image Upload**: Upload images to personal gallery
- **Gallery View**: Browse all uploaded images in a grid layout
- **Pagination**: Load more images with infinite scroll
- **Image Management**: Delete or manage individual images
- **Modal Preview**: View full-size images with image modal

### ⚙️ Account Settings

- **Change Password**: Update account password securely
- **Enable/Disable 2FA**: Toggle two-factor authentication
- **Delete Account**: Permanently delete user account with confirmation
- **Logout**: Secure logout from application

### 🎨 User Interface

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Tailwind CSS**: Modern styling with Tailwind CSS and custom components
- **Gradient Backgrounds**: Beautiful gradient UI elements
- **Loading States**: Smooth loading indicators for better UX
- **Toast Notifications**: Real-time feedback with success/error messages
- **Modal Dialogs**: Confirmation modals for critical actions

### 🔄 State Management

- **Redux Toolkit**: Global state management for auth and user data
- **Redux Persist**: Persist auth state across sessions
- **RTK Query**: Efficient data fetching and caching

### 🛣️ Routing

- **Protected Routes**: Authenticated routes with automatic redirects
- **Public Routes**: Login, register, and password reset pages
- **Lazy Loading**: Code splitting with React.lazy for optimal performance
- **Dynamic Navigation**: Tab-based navigation in dashboard

### 📱 Form Handling

- **React Hook Form**: Efficient form validation and state management
- **Real-time Validation**: Instant form validation feedback
- **Error Handling**: Comprehensive error messages for users

## Tech Stack

### Core Dependencies

- **React 19.2.0**: Latest React version with modern features
- **Vite 7.3.1**: Ultra-fast build tool and dev server
- **Redux Toolkit 2.11.2**: State management solution
- **React Redux 9.2.0**: React bindings for Redux
- **React Router DOM 7.13.1**: Client-side routing
- **TailwindCSS 4.2.1**: Utility-first CSS framework
- **Tailwind Scrollbar 4.0.2**: Custom scrollbar styling

### UI & Icons

- **Heroicons 2.2.0**: Beautiful SVG icons
- **React Icons 5.6.0**: Icon library
- **React Toastify 11.0.5**: Toast notifications

### Forms & Utilities

- **React Hook Form 7.71.2**: Form validation and management
- **JS Cookie 3.0.5**: Cookie management
- **React QR Code 2.0.18**: QR code generation for 2FA

### Authentication

- **React OAuth Google 0.13.4**: Google OAuth integration
- **JWT Token Management**: Secure token handling with refresh mechanism

### Development Tools

- **ESLint 9.39.1**: Code quality tool
- **TypeScript Support**: Type definitions for React and DOM

## Project Structure

```
src/
├── assets/              # Static assets (images, etc.)
├── Components/          # Reusable UI components
│   ├── DetailsNavbar    # Navigation component
│   ├── Footer           # Footer component
│   ├── Home             # Home dashboard
│   ├── Media            # Media gallery
│   ├── Settings         # Account settings
│   └── ShowAllDetails   # Main details container
├── Features/            # Redux slices and API
│   ├── auth/            # Authentication features
│   └── user/            # User profile features
├── Pages/               # Page components
│   ├── Auth/            # Authentication pages
│   └── Users/           # User pages
├── Route/               # Routing configuration
├── utils/               # Utility functions
└── config/              # Configuration constants
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies

```bash
npm install
```

3. Create environment variables

```bash
# Create .env file in root directory
VITE_API_URL=<your-api-url>
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
```

4. Start development server

```bash
npm run dev
```

5. Build for production

```bash
npm run build
```

6. Preview production build

```bash
npm run preview
```

## Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Performance Optimization

### React.memo Usage

Components that should be wrapped with React.memo to prevent unnecessary re-renders:

1. **Footer.jsx** - Static footer component
2. **DetailsNavbar.jsx** - Navigation navbar
3. **ImageGrid.jsx** - Image grid list component
4. **MediaImageModal.jsx** - Image modal for media gallery
5. **ImageModal.jsx** - Image modal for profile picture
6. **ShowDetailsCard Components** - Card display components (Personal, Professional, Contact, Social)
7. **Settings Modal Components** - ChangePassword, DeleteAccount, LogoutModal, TwoFactor
8. **Edit Form Components** - EditPersonal, EditProfessional, EditContact, EditSocial

### Implementation Example

```javascript
import React from "react";

// Before
const MyComponent = ({ data }) => {
  return <div>{data}</div>;
};

// After
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

export default MyComponent;
```

### useMemo Hook

Recommended for expensive computations:

- Inside showAllDetails, when filtering or transforming data
- When processing user data before display

### useCallback Hook

Recommended for event handlers:

- Form submission handlers in edit components
- Modal open/close handlers
- Image upload/delete handlers

## Auto Token Refresh

The application implements automatic JWT token refresh:

- Tokens are refreshed before expiry
- Refresh timer starts on successful login
- Background refresh prevents session interruption
- Automatic logout if token refresh fails

## Two-Factor Authentication

2FA implementation uses TOTP (Time-based One-Time Password):

- QR code generation for authenticator apps
- Backup codes for account recovery
- Optional 2FA on account settings

## Form Validation

All forms use React Hook Form with validation:

- Email format validation
- Password strength requirements
- Required field validation
- Custom validation rules

## Error Handling

Comprehensive error handling system:

- Toast notifications for user feedback
- Error boundary components
- API error interception and formatting
- User-friendly error messages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code structure
2. Use React.memo for components that receive props
3. Apply useCallback for callbacks passed to memoized components
4. Keep components focused and reusable
5. Follow ESLint rules

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
