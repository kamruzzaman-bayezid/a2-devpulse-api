# 🚼 DevPulse

Internal Tech Issue & Feature Tracker

DevPulse is a backend REST API built for software teams to manage bugs and feature requests with proper authentication, authorization, and workflow control.

---

## 🌐 Live URL

🔗 [https://your-live-url.com](https://a2-devpulse-api.vercel.app/)

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration system
- Secure login with JWT
- Password hashing using bcrypt
- Role-based access control (Contributor / Maintainer)
- Protected routes using middleware

### 🐞 Issue Management
- Create issues (bug / feature request)
- View all issues
- View single issue details
- Update issues with permission rules
- Delete issues (maintainer only)

### ⚙ Workflow Rules
- Contributors can update only their own open issues
- Contributors cannot modify issue status
- Maintainers can update any issue
- Maintainers can manage issue workflow status independently

### 🛡 System Design
- Centralized error handling
- PostgreSQL connection pooling
- Raw SQL queries (no ORM / query builder)
- Dynamic SQL update system
- Consistent API response structure

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL |
| Driver | pg |
| Query Method | Raw SQL |
| Authentication | JSON Web Token (JWT) |
| Security | bcrypt |
| Config | dotenv |

---

## ⚙ Setup Steps

### 1. Clone Repository

```bash
git clone https://github.com/kamruzzaman-bayezid/a2-devpulse-api.git
```

### 2. Navigate Project

```bash
cd devpulse
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Environment Variables

Create `.env` file:

```env
PORT=

CONNECTION_STRING=

JWT_SECRET=

JWT_EXPIRES_IN=
```

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build Project

```bash
npm run build
```

### 7. Start Production Server

```bash
npm start
```

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user account |
| POST | `/api/auth/login` | Public | Authenticate user and return JWT |

---

### Issues

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Retrieve all issues |
| GET | `/api/issues/:id` | Public | Retrieve single issue details |
| PATCH | `/api/issues/:id` | Contributor (own open issue) / Maintainer | Update issue |
| DELETE | `/api/issues/:id` | Maintainer | Delete issue |

---

### Query Parameters

| Parameter | Values |
|----------|--------|
| sort | newest, oldest |
| type | bug, feature_request |
| status | open, in_progress, resolved |

---

## 🗄 Database Schema

### users

Stores registered users and authentication data.

| Field | Description |
|-------|-------------|
| id | Unique user identifier |
| name | Full name of user |
| email | Unique email address |
| password | Hashed password |
| role | contributor / maintainer |
| created_at | Account creation time |
| updated_at | Last update time |

---

### issues

Stores bug reports and feature requests.

| Field | Description |
|-------|-------------|
| id | Unique issue identifier |
| title | Issue title |
| description | Detailed description |
| type | bug / feature_request |
| status | open / in_progress / resolved |
| reporter_id | ID of issue creator |
| created_at | Issue creation time |
| updated_at | Last update time |
