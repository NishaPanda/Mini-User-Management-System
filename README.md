# Mini User Management System

A full-stack user management application with role-based access control (Admin/User), profile management, and secure authentication using JWT and HttpOnly cookies.

Developed for: **Purple Merit Technologies**

---

## 🔗 Live Deployment Links
- **Frontend:** [https://mini-user-management-system-seven.vercel.app](https://mini-user-management-system-seven.vercel.app)
- **Backend API:** [https://mini-user-management-system.onrender.com](https://mini-user-management-system.onrender.com)
- **API Documentation:** [Postman Collection / Swagger Link]

## 🚀 Project Overview & Purpose
The **Mini User Management System** is designed to provide a secure and responsive platform for managing user accounts. It features a dual-role system:
- **Users** can register, log in, view/edit their profile, and change their password.
- **Admins** have access to a dedicated dashboard to view all registered users and manage their account status (Activate/Deactivate).

The project focuses on modern security practices, premium UI/UX design, and seamless full-stack integration.

---

## 🛠 Tech Stack Used

### Frontend
- **React.js** (Vite) - Framework
- **React Router Dom** - Routing
- **Axios** - API Requests
- **Vanilla CSS** - Premium Custom Styling
- **Lucide React** - Icons

### Backend
- **Node.js** & **Express.js** - Server Framework
- **MongoDB** & **Mongoose** - Database & ORM
- **JSON Web Tokens (JWT)** - Authentication
- **Bcrypt.js** - Password Hashing
- **Cookie-parser** - Secure Cookie Management
- **CORS** - Cross-Origin Resource Sharing

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` folder (see Environment Variables section).
4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Frontend` folder (see Environment Variables section).
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Variables

### Backend (.env)
- **PORT**: Port number for the server (e.g., 8080).
- **MONGODB_URI**: Connection string for the MongoDB database.
- **JWT_SECRET**: Secret key used for signing JWT tokens.
- **FRONTEND_URL**: URL of the frontend application for CORS.

### Frontend (.env)
- **VITE_API_URL**: The base URL for the Backend API.

---

## 🌐 Deployment Instructions

### Frontend (Vercel)
1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Set the **Build Command** to `npm run build`.
4. Set the **Output Directory** to `dist`.
5. Add the `VITE_API_URL` environment variable pointing to your hosted backend.

### Backend (Render/Railway)
1. Push your code to GitHub.
2. Create a new Web Service.
3. Set the **Start Command** to `npm start`.
4. Add all Backend environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.).
5. Ensure `FRONTEND_URL` matches your hosted Vercel URL.

---

## 📖 API Documentation

### Authentication
#### **Register User**
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

#### **Login User**
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Response (200):** Sets an HttpOnly cookie with JWT.
  ```json
  {
    "message": "Login successful",
    "user": { "id": "...", "fullName": "John Doe", "role": "user" }
  }
  ```

### User Profile
#### **Get Profile**
- **URL:** `/api/user/profile`
- **Method:** `GET` (Requires Auth Cookie)
- **Response (200):**
  ```json
  {
    "user": { "fullName": "John Doe", "email": "john@example.com", "role": "user", "isActive": true }
  }
  ```

### Admin Actions
#### **Get All Users**
- **URL:** `/api/admin/getallusers?page=1&limit=10`
- **Method:** `GET` (Requires Admin Role)
- **Response (200):**
  ```json
  {
    "users": [...],
    "totalPages": 5,
    "totalUsers": 48
  }
  ```

#### **Update User Status**
- **URL:** `/api/admin/users/:id/activate` or `/api/admin/users/:id/deactivate`
- **Method:** `PATCH` (Requires Admin Role)
- **Response (200):**
  ```json
  {
    "message": "User status updated successfully"
  }
  ```
