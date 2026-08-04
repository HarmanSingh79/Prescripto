# Prescripto — Doctor Appointment Booking App

Prescripto is a full-stack MERN application that lets patients discover trusted doctors and book appointments online. It includes a patient-facing website, an admin panel for managing doctors and appointments, and a doctor panel for managing schedules, profiles, and earnings.

## Live Demo

- Patient Website: prescripto-by-harman.vercel.app
- Admin Panel: prescripto-admin-harman.vercel.app
- Backend API: prescripto-backend-harman.vercel.app

## Features

### Patient Website
- Browse doctors by speciality
- View doctor profiles, fees, and availability
- Book, manage, and cancel appointments
- Secure online payments via Razorpay
- User authentication and editable profile

### Admin Panel
- Add, view, and manage doctor listings
- View and manage all patient appointments
- Dashboard with key stats (earnings, appointments, doctors)
- Cancel appointments on behalf of patients

### Doctor Panel
- Doctor login and profile management
- View and manage personal appointments
- Mark appointments as completed
- Dashboard with earnings and appointment overview

## Tech Stack

**Frontend (Patient site & Admin panel):**
- React (Vite)
- Tailwind CSS
- Axios
- React Router
- React Toastify

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (image uploads)
- Razorpay (payments)

**Deployment:**
- Vercel (frontend, admin, and backend)

## Project Structure

```
Prescripto/
├── frontend/     # Patient-facing website
├── admin/        # Admin & Doctor panel
└── backend/      # Express REST API
```

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB Atlas connection string
- A Cloudinary account (for image storage)
- A Razorpay account (for payments)

### 1. Clone the repository
```bash
git clone https://github.com/HarmanSingh79/Prescripto.git
cd Prescripto
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
EMAIL_USER=your_email
EMAIL_APP_PASSWORD=app_password_generated_through_email
```

Run the backend:
```bash
npm run server
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/` with:
```
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_ENABLE_PHONE_OTP=false
```

Run the frontend:
```bash
npm run dev
```

### 4. Admin Panel Setup
```bash
cd ../admin
npm install
```

Create a `.env` file inside `admin/` with:
```
VITE_BACKEND_URL=http://localhost:4000
```

Run the admin panel:
```bash
npm run dev
```

## Deployment

Each folder (`frontend`, `admin`, `backend`) is deployed as a separate project on Vercel, with environment variables configured individually in each project's Vercel dashboard settings. The backend uses a `vercel.json` to run as a serverless Node/Express deployment.

## Payments

Razorpay handles all appointment payments. Test mode is used during development; switching to live mode requires generating live API keys from the Razorpay dashboard after completing account activation.

## License

This project is open source and available for learning purposes.

## Contact

For questions or feedback, reach out at harmansinghnew1@gmail.com
