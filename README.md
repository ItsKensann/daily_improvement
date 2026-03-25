# Focus: Minimalist Productivity App

<img width="951" height="470" alt="image" src="https://github.com/user-attachments/assets/d63a9709-d276-47e8-9239-baaedde81461" />

Focus is a full-stack MERN application designed to help users achieve deep work through a distraction-free, minimalist interface. It combines task management, a tab-safe Pomodoro timer, journaling, and AI-driven productivity insights.

**Live Demo:** [View Live App](<https://focus-two-zeta.vercel.app/>)

## 🌟 Core Features

* **Secure Authentication:** Google OAuth 2.0 integration using Passport.js and secure session cookies.
* **Tab-Safe Focus Timer:** A resilient Pomodoro timer that survives tab changes and accidental refreshes using `localStorage` syncing. Automatically logs focus minutes to specific tasks.
* **Minimalist Task Management:** Clean CRUD interface for managing daily tasks and priorities.
* **Journaling Engine:** A private space to record daily reflections and energy levels.
* **Analytical Dashboard:** Aggregates user data (Focus Hours, Task Completion) into visual metrics and a weekly deep-work chart using a Backend-for-Frontend (BFF) architecture.
* **AI Daily Insights:** Integrates with Google Gemini 3 Flash Preview to analyze the user's recent tasks and journal entries, returning highly personalized, structured JSON insights acting as a digital mindfulness coach.

## 🛠️ Tech Stack

**Frontend:**
* React (Vite)
* Tailwind CSS (Custom minimalist UI)
* TanStack Query (React Query) for server-state caching and instant UI updates
* React Router DOM
* Lucide React (Icons)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Complex aggregations for dashboard stats)
* Passport.js (Google Strategy)
* Express-Session & Connect-Mongo
* Google Generative AI SDK (Gemini)

## 🚀 Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/zenspace.git
cd zenspace
```

**2. Install dependencies** for both the frontend and backend:
```bash
cd server && npm install
cd ../client && npm install
```

**3. Set up environment variables**

In `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_super_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=/auth/google/callback

GEMINI_API_KEY=your_gemini_api_key
```

In `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

**4. Run the application** in two terminal windows:
```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Visit `http://localhost:5173` to get started.

## 🌐 Deployment
* **Frontend:** Deployed on [Vercel](https://vercel.com/)
* **Backend:** Deployed on [Render](https://render.com/)
* **Database:** Hosted on [MongoDB Atlas](https://www.mongodb.com/atlas)
