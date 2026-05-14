# PostHub Backend

A production-grade REST API built for the PostHub platform using Node.js, Express, TypeScript, and MongoDB.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (v6 compatibility)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) via HTTP-only cookies
- **Security**: bcryptjs for password hashing, CORS
- **Architecture**: Feature-based modular structure

## Features

- 🔐 **Authentication**: Secure login/logout using HTTP-only cookies.
- 👥 **Role-Based Access Control (RBAC)**: Supports `admin` and `user` roles.
- 📝 **Posts Management**: Full CRUD capabilities for platform content.
- 🛡️ **Middlewares**: Custom error handling, authentication, and role authorization middlewares.
- 🌱 **Auto-Seeding**: Automatically seeds default Admin and User accounts on first run.

## Setup Instructions

Follow these steps to run the backend locally:

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Running locally on `localhost:27017` or an Atlas URI

### 2. Installation
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

### 3. Environment Variables
The `.env` file is already provided and tracked for your convenience. However, if you need to recreate it, copy from the example:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-app
JWT_SECRET=super_secret_jwt_key_change_in_production_2024
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Running the Server
Start the development server with hot-reloading (using `tsx`):
```bash
npm run dev
```
The server will start on `http://localhost:5000` and automatically seed two accounts:
- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

## Available Scripts

- `npm run dev`: Starts the dev server using `tsx`.
- `npm run build`: Compiles TypeScript source files to JavaScript in the `dist/` folder.
- `npm start`: Runs the production-ready server from the `dist/` folder.
