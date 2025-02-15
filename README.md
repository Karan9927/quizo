# Quizo

Quizo is a full-stack quiz application built with React (Vite) for the frontend and Node.js (Express) with Supabase for the backend.

## Project Structure
```
quizo/
├── frontend/      # React (Vite) frontend
├── quizo-backend/ # Express + Prisma backend
└── README.md
```

## Prerequisites
- **Node.js** (v18 or later)
- **PostgreSQL** (via Supabase)
- **NPM or Yarn** (for package management)

## Environment Variables
### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3001
```

### Backend (`quizo-backend/.env`)
```env
DATABASE_URL="your-supabase-database-url"
DIRECT_URL="your-direct-database-url"
```
Ensure you replace the database URLs with the correct credentials from your Supabase project.

## CORS Configuration

The backend includes CORS settings to allow requests from both the deployed frontend and local development environments.

### **Allowed Origins:**
- **Local Development:** `http://localhost:5174`
- **Production Frontend:** `https://quizo-frontend-eight.vercel.app`

### **CORS Settings:**
- **Methods:** `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **Headers:** `Content-Type`, `Authorization`
- **Credentials Enabled:** `true` (Supports authentication and session management)

---
### **Default Login Credentials:**

- **Username:** `admin`
- **Password:** `password`
## Installation and Setup
### 1. Clone the repository
```sh
git clone https://github.com/your-repo/quizo.git
cd quizo
```

### 2. Install Dependencies
#### Frontend
```sh
cd frontend
npm install
```
#### Backend
```sh
cd quizo-backend
npm install
```

### 3. Database Setup
Run Prisma migrations to set up the database schema.
```sh
cd quizo-backend
npm run prisma:migrate
npm run prisma:generate
```

### 4. Start the Development Servers
#### Backend
```sh
cd quizo-backend
npm run dev
```
By default, the backend runs on **http://localhost:3001**.

#### Frontend
```sh
cd frontend
npm run dev
```
The frontend runs on **http://localhost:5173** (default Vite port).

---

## API Documentation
### Authentication
#### **Login**
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "username": "user123",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "userId": "12345",
      "username": "user123"
    }
  }
  ```

### Quiz Management
#### **Create a Quiz**
- **Endpoint:** `POST /api/quizzes`
- **Request Body:**
  ```json
  {
    "title": "JavaScript Basics",
    "description": "A quiz on JavaScript fundamentals",
    "userId": "teacher123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Quiz created successfully",
    "data": {
      "id": "quiz123",
      "title": "JavaScript Basics",
      "description": "A quiz on JavaScript fundamentals",
      "teacher_id": "teacher123"
    }
  }
  ```

#### **Fetch All Quizzes**
- **Endpoint:** `GET /api/quizzes?userId={userId}`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "quiz123",
        "title": "JavaScript Basics",
        "description": "A quiz on JavaScript fundamentals",
        "teacher_id": "teacher123",
        "created_at": "2025-02-15T12:00:00Z"
      }
    ]
  }
  ```

#### **Get Quiz by ID**
- **Endpoint:** `GET /api/quizzes/{quizId}?userId={userId}`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "quiz123",
      "title": "JavaScript Basics",
      "description": "A quiz on JavaScript fundamentals",
      "teacher_id": "teacher123",
      "created_at": "2025-02-15T12:00:00Z"
    }
  }
  ```

#### **Update a Quiz**
- **Endpoint:** `PUT /api/quizzes/{quizId}`
- **Request Body:**
  ```json
  {
    "title": "Updated Quiz Title",
    "description": "Updated quiz description",
    "userId": "teacher123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Quiz updated successfully",
    "data": {
      "id": "quiz123",
      "title": "Updated Quiz Title",
      "description": "Updated quiz description",
      "teacher_id": "teacher123"
    }
  }
  ```

#### **Delete a Quiz**
- **Endpoint:** `DELETE /api/quizzes/{quizId}?userId={userId}`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Quiz deleted successfully"
  }
  ```

---

## Additional Commands
### Run Prisma Studio (Database GUI)
```sh
cd quizo-backend
npm run prisma:studio
```

### Build Production Versions
#### Frontend
```sh
cd frontend
npm run build
```
#### Backend
```sh
cd quizo-backend
npm start
```
