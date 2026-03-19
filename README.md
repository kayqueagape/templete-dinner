<div align="center">

# 🍽️ Templete Dinner — Frontend

**A modern, ready-to-use frontend template for restaurant web applications.**

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![ESLint](https://img.shields.io/badge/ESLint-Configured-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

---

### 🌐 [Live Demo →](https://templete-dinner.onrender.com) &nbsp;|&nbsp; 🔙 [Backend Repository →](https://github.com/kayqueagape/DineExplore)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Live Demo](#-live-demo)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Pages & Components](#-pages--components)
- [API Service](#-api-service)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🗺️ Overview

**Templete Dinner** is a complete starting point for building restaurant web applications. Comes with authentication screens, restaurant listing and management pages, reusable components, and a centralized API service layer — all wired up with React Router and ready to connect to a RESTful backend.

> **Status:** ✅ Ready for local development and production deployment

---

## ✨ Features

- 📱 **Fully responsive** layout built with Tailwind CSS
- 🔀 **Client-side routing** with React Router v6
- 🔐 **Authentication pages** — Login and Register screens
- 🍴 **Restaurant pages** — List, details, create, and edit
- 👤 **User pages** — Profile and admin/user management views
- 🧩 **Reusable components** — `Navbar`, `RestaurantCard` and more
- 🌐 **Centralized API layer** — all HTTP calls in `services/api.js`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [ESLint](https://eslint.org/) | Code linting |
| [dotenv / Vite env](https://vitejs.dev/guide/env-and-mode) | Environment variable management |

---

## 🌐 Live Demo

| | Link |
|---|---|
| 🌍 **Live Application** | [https://templete-dinner.onrender.com](https://templete-dinner.onrender.com) |
| 💻 **Frontend Repository** | [github.com/your-username/templete-dinner](https://github.com/your-username/templete-dinner) |
| 🔙 **Backend Repository** | [github.com/kayqueagape/DineExplore](https://github.com/kayqueagape/DineExplore) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/) (LTS recommended)
- npm or yarn

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/your-username/templete-dinner.git
cd templete-dinner
```

**2. Install dependencies:**

```bash
npm install
```

**3. Configure environment variables** *(see section below)*

**4. Start the development server:**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root. All variables must be prefixed with `VITE_` to be exposed to the client by Vite.

```env
# Base URL of the backend API
VITE_API_URL=http://localhost:3000
```

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL for the backend REST API | `http://localhost:3000` |

> 💡 For production, point `VITE_API_URL` to your deployed backend URL.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Generate an optimized production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 📁 Project Structure

```
templete-dinner/
│
├── index.html                    # HTML entry point
├── public/                       # Static assets
├── .env                          # Environment variables (not committed)
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
└── src/
    ├── main.jsx                  # Application bootstrap
    ├── App.jsx                   # Routing & base layout
    ├── index.css                 # Global styles (Tailwind directives)
    │
    ├── components/
    │   ├── Navbar.jsx            # Top navigation bar
    │   └── RestaurantCard.jsx    # Restaurant summary card
    │
    ├── pages/
    │   ├── Home.jsx              # Restaurant listing
    │   ├── Login.jsx             # Login screen
    │   ├── Register.jsx          # Registration screen
    │   ├── Profile.jsx           # Logged-in user profile
    │   ├── Users.jsx             # User management / admin view
    │   ├── CreateRestaurant.jsx  # Add new restaurant form
    │   ├── EditRestaurant.jsx    # Edit existing restaurant form
    │   └── RestaurantDetails.jsx # Full restaurant detail view
    │
    └── services/
        └── api.js                # Centralized API client (uses VITE_API_URL)
```

---

## 🧩 Pages & Components

### Components

| Component | Description |
|---|---|
| `Navbar.jsx` | Top navigation bar with links for login, profile, and main sections |
| `RestaurantCard.jsx` | Reusable card displaying a restaurant's summary info |

### Pages

| Page | Route | Description |
|---|---|---|
| `Home.jsx` | `/` | Lists all restaurants using `RestaurantCard` |
| `RestaurantDetails.jsx` | `/restaurants/:id` | Full details view for a single restaurant |
| `CreateRestaurant.jsx` | `/restaurants/new` | Form for adding a new restaurant |
| `EditRestaurant.jsx` | `/restaurants/:id/edit` | Form for updating an existing restaurant |
| `Login.jsx` | `/login` | Authentication screen |
| `Register.jsx` | `/register` | New user registration screen |
| `Profile.jsx` | `/profile` | Logged-in user profile page |
| `Users.jsx` | `/users` | User management / admin view |

---

## 🌐 API Service

All HTTP calls are centralized in `src/services/api.js`, which uses `VITE_API_URL` as the base URL.

**Integration tips:**

- Store authentication tokens in `localStorage` or a React context (e.g. `AuthContext`)
- Add request/response interceptors in `api.js` for centralized error handling and token refresh
- Keep all API calls inside the service layer — avoid direct `fetch`/`axios` calls from pages or components
- Use the [DineExplore backend](https://github.com/kayqueagape/DineExplore) as the API — it's already built to match this frontend

---

## 📄 License

This project includes a `LICENSE` file in the root directory. Please review it before using or distributing this template.

---