# TaskFlow — Project Documentation

**Full-Stack React + Tailwind CSS + Appwrite Task Manager**
Version 1.0 | March 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Features](#3-features)
4. [Project Structure](#4-project-structure)
5. [Setup & Installation](#5-setup--installation)
6. [Appwrite Backend Configuration](#6-appwrite-backend-configuration)
7. [Environment Variables](#7-environment-variables)
8. [Authentication Flow](#8-authentication-flow)
9. [CRUD Operations](#9-crud-operations)
10. [Component Architecture](#10-component-architecture)
11. [Running the App](#11-running-the-app)

---

## 1. Project Overview

**TaskFlow** is a full-featured task management web application built with React (Vite) on the frontend and Appwrite as the Backend-as-a-Service (BaaS). Each user can register, log in, and manage their own private list of tasks with full Create, Read, Update, and Delete functionality.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | React 18 (Vite) | UI rendering, component logic |
| Styling | Tailwind CSS | Utility-first CSS |
| Backend / BaaS | Appwrite Cloud | Auth, Database, API |
| Routing | React state-based | Page transitions (no library) |
| Language | JavaScript (JSX) | Application code |

---

## 3. Features

### Authentication
- User registration (name, email, password)
- User login with email & password session
- Persistent login (session checked on app load)
- Logout (deletes current session)

### Task Management (CRUD)
- **Create** — Add tasks with a title and optional description
- **Read** — View all tasks filtered by user ID
- **Update** — Edit task title/description inline; toggle completion
- **Delete** — Remove individual tasks; bulk-clear completed tasks

### UX Features
- Filter tasks: All / Active / Done
- Progress bar showing completion percentage
- Optimistic UI updates (instant feedback before server confirms)
- Responsive design (mobile + desktop)

---

## 4. Project Structure

```
taskflow/
├── public/
├── src/
│   ├── appwrite/
│   │   ├── config.js       ← Appwrite SDK init + exports
│   │   ├── auth.js         ← register, login, logout, getUser
│   │   └── tasks.js        ← create, getAll, update, delete
│   ├── pages/
│   │   ├── LoginPage.jsx       ← Login form
│   │   ├── RegisterPage.jsx    ← Register form
│   │   └── DashboardPage.jsx   ← Main task view + CRUD
│   ├── App.jsx             ← Root component + routing state
│   ├── main.jsx            ← React entry point
│   └── index.css           ← Tailwind directives
├── .env                    ← Secret config (never commit)
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 5. Setup & Installation

### Prerequisites
- Node.js 18+ installed
- An Appwrite account at [cloud.appwrite.io](https://cloud.appwrite.io)

### Step 1 — Scaffold the project

```bash
npm create vite@latest taskflow -- --template react
cd taskflow
npm install
```

### Step 2 — Install dependencies

```bash
npm install appwrite react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3 — Configure Tailwind

**`tailwind.config.js`**
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**`src/index.css`** — replace all content with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 6. Appwrite Backend Configuration

### Step 1 — Create Project
1. Log in to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Click **"Create Project"** → Name: `TaskFlow`
3. Copy the **Project ID** from the dashboard

### Step 2 — Add Web Platform
- Go to **Settings → Platforms → Add Platform → Web**
- Hostname: `localhost`
- This allows your local dev server to make API calls

### Step 3 — Create Database & Collection
1. Go to **Databases → Create Database**
   - Name: `taskflow-db`
   - Copy the **Database ID**
2. Inside the database → **Create Collection**
   - Name: `tasks`
   - Copy the **Collection ID**

### Step 4 — Add Collection Attributes

| Attribute Key | Type | Size | Required |
|--------------|------|------|----------|
| `title` | String | 255 | ✅ Yes |
| `description` | String | 1000 | ❌ No |
| `completed` | Boolean | — | ✅ Yes |
| `userId` | String | 255 | ✅ Yes |

### Step 5 — Set Permissions
- Go to the `tasks` collection → **Settings → Permissions**
- Add role: **`Users`**
- Check: ✅ Create, ✅ Read, ✅ Update, ✅ Delete

> This ensures only authenticated users can access tasks, and each user can only query their own (enforced via `userId` filter in code).

---

## 7. Environment Variables

Create a `.env` file in the project root:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_COLLECTION_ID=your_collection_id_here
```

> ⚠️ **Never commit `.env` to Git.** Add it to `.gitignore`.

---

## 8. Authentication Flow

### How it works

```
App loads
  └─ authService.getUser() ──→ success → show Dashboard
                             └─ fail   → show Login page

Login page
  └─ authService.login(email, password)
       └─ success → authService.getUser() → store user → Dashboard
       └─ fail    → show error message

Register page
  └─ authService.register(email, password, name)
       └─ then authService.login(email, password)
            └─ then authService.getUser() → store user → Dashboard

Dashboard
  └─ Sign Out button → authService.logout() → Login page
```

### Code — `src/appwrite/auth.js`

```js
import { account, ID } from "./config";

export const authService = {
  register: (email, password, name) =>
    account.create(ID.unique(), email, password, name),

  login: (email, password) =>
    account.createEmailPasswordSession(email, password),

  logout: () => account.deleteSession("current"),

  getUser: () => account.get(),
};
```

**Key concepts:**
- `ID.unique()` — Appwrite generates a unique user ID
- `createEmailPasswordSession` — creates a session cookie
- `account.get()` — verifies the session and returns current user
- `deleteSession("current")` — logs out the current device

---

## 9. CRUD Operations

### Code — `src/appwrite/tasks.js`

```js
import { databases, ID, Query, DB_ID, COL_ID } from "./config";

export const taskService = {
  create: (title, description, userId) =>
    databases.createDocument(DB_ID, COL_ID, ID.unique(), {
      title, description, completed: false, userId,
    }),

  getAll: (userId) =>
    databases.listDocuments(DB_ID, COL_ID, [Query.equal("userId", userId)]),

  update: (id, data) =>
    databases.updateDocument(DB_ID, COL_ID, id, data),

  delete: (id) =>
    databases.deleteDocument(DB_ID, COL_ID, id),
};
```

### CRUD Summary

| Operation | Method | What it does |
|-----------|--------|-------------|
| **Create** | `createDocument` | Adds new task with userId |
| **Read** | `listDocuments` + `Query.equal` | Fetches only current user's tasks |
| **Update** | `updateDocument` | Edits title/description or toggles completed |
| **Delete** | `deleteDocument` | Removes task by document ID |

### Optimistic Updates
The Dashboard updates React state **immediately** before the Appwrite call completes. This makes the UI feel instant. If the server call fails, a page refresh would restore the real state — for production apps, add error rollback logic.

---

## 10. Component Architecture

### `App.jsx` — Root + Router
- Holds `user` state and `page` state
- On mount: checks for existing Appwrite session
- Passes `onLogin` / `onLogout` handlers down to pages
- Conditionally renders Login / Register / Dashboard

### `LoginPage.jsx`
- Form with email + password fields
- Calls `authService.login()` → then `authService.getUser()`
- Calls `onLogin(user)` to lift user state up to App

### `RegisterPage.jsx`
- Form with name + email + password fields
- Registers then immediately logs in (seamless UX)
- Same `onLogin(user)` callback pattern

### `DashboardPage.jsx` (main view)
Contains two sub-components:

**`TaskForm`** (inline, collapsible)
- Collapsed state: "+ Add a task" button
- Expanded state: title + description inputs + submit
- Calls `onAdd(title, desc)` which calls `taskService.create()`

**`TaskCard`** (per task)
- Normal mode: shows title, description, checkbox, hover actions
- Edit mode: inputs for title + description + save/cancel
- Toggle checkbox → calls `onToggle(id, !completed)`
- Pencil icon → switches to edit mode
- Trash icon → calls `onDelete(id)`

---

## 11. Running the App

```bash
# Development server (with hot reload)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Missing scope" error | Check collection permissions — add `Users` role |
| Tasks not loading | Verify `userId` attribute exists in collection |
| CORS error | Add `localhost` as a Web Platform in Appwrite |
| `.env` not working | Ensure variable names start with `VITE_` |
| Login fails silently | Check browser console; verify Project ID in `.env` |

---

*Built with React, Tailwind CSS, and Appwrite Cloud.*
