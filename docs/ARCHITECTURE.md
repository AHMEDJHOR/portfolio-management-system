# System Architecture

## 1. Overview

The Personal Portfolio Management System follows a layered architecture that separates presentation, business logic, data access, and infrastructure concerns.

The system consists of:

* React Frontend
* Express Backend
* PostgreSQL Database
* Cloudinary Storage
* Email Service

---

# 2. High-Level Architecture

```text
Browser
   │
   ▼
React Frontend
   │
   │ HTTP/HTTPS
   ▼
Express REST API
   │
   ├── Authentication
   ├── Validation
   ├── Business Logic
   ├── File Upload
   └── Email Service
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```

---

# 3. Frontend Architecture

Technology Stack:

* React 19
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* TanStack Query
* React Router
* React Hook Form
* Zod
* Axios

### Frontend Folder Structure

```text
frontend/
└── src/
    ├── api/
    ├── assets/
    ├── components/
    │   ├── common/
    │   ├── forms/
    │   ├── layout/
    │   └── ui/
    │
    ├── features/
    │   ├── auth/
    │   ├── projects/
    │   ├── skills/
    │   ├── blogs/
    │   └── messages/
    │
    ├── hooks/
    ├── layouts/
    ├── pages/
    ├── routes/
    ├── schemas/
    ├── services/
    ├── store/
    ├── types/
    ├── utils/
    └── main.tsx
```

---

# 4. Backend Architecture

Technology Stack:

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL

### Backend Folder Structure

```text
backend/
└── src/
    ├── config/
    ├── constants/
    ├── middleware/
    ├── modules/
    ├── routes/
    ├── services/
    ├── utils/
    ├── types/
    ├── validations/
    ├── app.ts
    └── server.ts
```

---

# 5. Module Structure

Each feature module follows the same pattern.

Example:

```text
modules/
└── project/
    ├── project.controller.ts
    ├── project.service.ts
    ├── project.repository.ts
    ├── project.schema.ts
    ├── project.routes.ts
    ├── project.types.ts
    └── index.ts
```

---

# 6. Request Flow

Example request:

```text
GET /api/v1/projects
```

Flow:

```text
Client
  │
  ▼
Route
  │
  ▼
Middleware
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Repository
  │
  ▼
Prisma
  │
  ▼
Database
```

Response travels back through the same path.

---

# 7. Authentication Architecture

Authentication Method:

* JWT Access Token
* JWT Refresh Token

### Login Flow

```text
User Login
    │
    ▼
Verify Credentials
    │
    ▼
Generate Access Token
    │
    ▼
Generate Refresh Token
    │
    ▼
Return Tokens
```

---

# 8. Validation Strategy

Validation Library:

* Zod

Frontend:

```text
Form
   │
   ▼
React Hook Form
   │
   ▼
Zod Validation
```

Backend:

```text
Request
   │
   ▼
Zod Schema
   │
   ▼
Controller
```

All incoming data must be validated before reaching business logic.

---

# 9. Error Handling Strategy

Centralized error handling shall be used.

Example:

```text
Route
   │
   ▼
Controller
   │
   ▼
Throw Error
   │
   ▼
Global Error Handler
   │
   ▼
JSON Response
```

Response Format:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

# 10. Logging Strategy

Library:

* Pino

Log Types:

* Request Logs
* Error Logs
* Authentication Logs
* Upload Logs

Log Directory:

```text
logs/
├── combined.log
└── error.log
```

---

# 11. File Upload Strategy

Development:

```text
uploads/
├── profile/
├── projects/
├── blogs/
└── certifications/
```

Production:

```text
Cloudinary
```

Upload Flow:

```text
Frontend
   │
   ▼
Express
   │
   ▼
Multer
   │
   ▼
Cloudinary
```

---

# 12. Email Architecture

Library:

* Nodemailer

Use Cases:

* Contact Form Notifications
* Future Newsletter Support

Flow:

```text
Visitor
   │
   ▼
Contact Form
   │
   ▼
Backend
   │
   ▼
Email Service
   │
   ▼
Administrator Inbox
```

---

# 13. Database Architecture

Database:

* PostgreSQL

ORM:

* Prisma

Migration Tool:

* Prisma Migrate

Database access shall only occur through Prisma.

---

# 14. Security Architecture

Security Libraries:

* Helmet
* CORS
* bcrypt
* express-rate-limit
* JWT

Security Measures:

* Password Hashing
* Input Validation
* Protected Routes
* Secure Headers
* Rate Limiting

---

# 15. Deployment Architecture

Frontend:

* Vercel or Netlify

Backend:

* VPS or Render

Database:

* PostgreSQL

Media Storage:

* Cloudinary

CI/CD:

* GitHub Actions

---

# 16. Development Standards

Code Quality Tools:

* ESLint
* Prettier
* Husky
* lint-staged
* Commitlint

Commit Convention:

```text
feat:
fix:
docs:
refactor:
test:
chore:
```

---

# 17. Future Scalability

The architecture is designed to support:

* Multiple administrators
* Analytics dashboard
* Real-time notifications
* Newsletter subscriptions
* Portfolio visitor statistics
* AI integrations

without significant architectural changes.
