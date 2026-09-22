# Codelabs KPI Backend API

A comprehensive RESTful API for managing Key Performance Indicators (KPI) at Codelabs. Built with **Node.js, Express.js, TypeScript**, and **MongoDB**.

**Deployment Link:** https://codelabspace.or.id/

---

## 🚀 Features Overview

This backend service provides a wide range of endpoints to support the KPI management system:
- **Authentication & User Management:** Secure login (JWT/Bcrypt), role-based access, and user profile management.
- **Attendance & Scheduling:** Track member attendances and manage schedules.
- **KPI Tracking Modules:**
  - **Operational Records:** Manage day-to-day operational activities.
  - **Research & Competition:** Track research progress and competition participation.
  - **Branding & Products:** Manage branding activities and product development.
  - **KPI Items:** Core KPI metric configurations and tracking.
- **File Uploads:** Integrated with Cloudflare R2 (S3-compatible) for secure file storage and Multer for multipart form handling.

---

## 🛠️ Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** MongoDB (using Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), Bcrypt for password hashing
- **Storage:** Cloudflare R2 / AWS S3 SDK (`@aws-sdk/client-s3`)
- **Other Utilities:** Multer, Telegraf (Telegram Bot), Luxon (Date/Time), Cors, Dotenv
- **Deployment:** Docker & Docker Compose

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Docker](https://www.docker.com/) (Optional, for containerized deployment)

---

## 💻 Local Setup & Development

1. **Clone the repository & Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   **Key Variables:**
   - `PORT`: API Port (e.g., 3000 or 5500)
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT signing
   - `R2_*`: Cloudflare R2 credentials for file storage

3. **Run the Development Server:**
   This will start the server using `nodemon` and `ts-node` with hot-reload enabled.
   ```bash
   npm run dev
   ```

4. **Database Seeding (Optional):**
   If you need to populate initial data:
   ```bash
   npm run seed
   ```

---

## 📦 Build & Production

To build the TypeScript code and run the production server:

1. **Build the project:**
   ```bash
   npm run build
   ```
   *(This compiles TypeScript into the `dist/` directory)*

2. **Start the production server:**
   ```bash
   npm start
   ```

---

## 🐳 Docker Deployment

The project includes a `dockerfile` and `docker-compose.yml` for easy containerized deployment.

1. Ensure your `.env` file is properly configured.
2. Build and start the container in detached mode:
   ```bash
   docker compose up -d --build
   ```
   The API will be accessible on port `5500` (or as defined in `docker-compose.yml`).

---

## 📂 Project Structure

```text
src/
├── config/       # Database & external service configurations
├── controllers/  # Request handlers and business logic entry points
├── helper/       # Reusable utility functions
├── jobs/         # Background tasks or cron jobs
├── middlewares/  # Express middlewares (Auth, Error handling, etc.)
├── models/       # Mongoose database schemas
├── repository/   # Data access layer for database queries
├── routes/       # API route definitions
├── services/     # Core business logic layer
├── validators/   # Request payload validation logic
└── index.ts      # Application entry point
```

---
*Created and maintained for Codelabs KPI Management System.*
