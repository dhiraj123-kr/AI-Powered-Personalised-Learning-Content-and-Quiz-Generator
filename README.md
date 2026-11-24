# 🎓 AI-Powered Personalised Learning Content and Quiz Generator

> A complete, production-quality full-stack AI educational platform built for B.Tech Computer Science project.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| AI Engine | Google Gemini API (gemini-1.5-flash) |
| Auth | JWT + bcrypt |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | react-hot-toast |

---

## 📁 Project Structure

```
AI-Powered Personalised Learning Content and Quiz Generator/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Route logic
│   ├── middleware/            # Auth, error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routes
│   ├── utils/                 # Gemini, helpers, seeder
│   ├── .env                   # Environment variables (create this!)
│   ├── .env.example
│   └── server.js
│
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # All page components
│   │   └── services/          # API service layer
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+ 
- MongoDB (local or Atlas)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone / Navigate to project

```bash
cd "AI-Powered Personalised Learning Content and Quiz Generator"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file (copy from `.env.example`):
```bash
copy .env.example .env
```

Edit `.env` and fill in:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai_learning_platform
JWT_SECRET=your_secure_secret_here
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 3. Seed the Database (optional but recommended)

```bash
npm run seed
```

This creates:
- 1 Admin account (admin@learning.com / password123)
- 5 Student accounts (student1@test.com to student5@test.com / password123)
- 6 Subjects with topics (Math, Physics, CS, Chemistry, English, Biology)

### 4. Start Backend

```bash
npm run dev
```
Backend runs at: `http://localhost:5000`

### 5. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🔑 Getting Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `backend/.env` as `GEMINI_API_KEY`

> ⚠️ **Never commit your .env file!** It's listed in .gitignore.

---

## 🌟 Features

### 👨‍🎓 Student Features
- **AI Notes Generator** — Generate detailed study notes, summaries, explanations, examples, exam questions using Gemini AI
- **AI Quiz Generator** — Auto-generate MCQ quizzes (5–20 questions) with timer, evaluation, and explanations  
- **Performance Analytics** — Track scores, weak/strong topics, progress over time with interactive charts
- **Personalized Recommendations** — AI-driven learning path recommendations based on quiz performance
- **AI Study Assistant** — Conversational chatbot for educational Q&A

### 🛠️ Admin Features
- Manage student accounts
- Add/Edit/Delete subjects and topics
- View platform-wide statistics

### 🔐 Security
- JWT authentication with 7-day expiry
- bcrypt password hashing (10 salt rounds)
- Rate limiting on API endpoints
- Helmet.js security headers
- CORS configuration

---

## 📊 Database Collections

| Collection | Purpose |
|-----------|---------|
| Users | Student and admin accounts |
| Subjects | Academic subjects |
| Topics | Topics within subjects |
| LearningContents | AI-generated study materials |
| Quizzes | Generated quiz questions |
| QuizResults | Student quiz attempts and scores |
| Recommendations | Personalized learning paths |
| ChatHistory | AI chatbot conversations |

---

## 🛣️ API Endpoints

### Auth
- `POST /api/auth/register` — Register student
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user
- `PUT /api/auth/profile` — Update profile
- `POST /api/auth/change-password` — Change password

### Subjects & Topics
- `GET /api/subjects` — Get all subjects
- `GET /api/subjects/:id` — Get subject with topics
- `GET /api/topics/subject/:subjectId` — Get topics by subject

### AI Content
- `POST /api/content/generate` — Generate AI study content
- `GET /api/content` — Get user's content history

### Quiz
- `POST /api/quiz/generate` — Generate AI quiz
- `GET /api/quiz` — Get user's quizzes
- `POST /api/quiz-results/submit` — Submit quiz answers

### Analytics
- `GET /api/analytics` — Get student performance analytics

### Recommendations
- `GET /api/recommendations` — Get personalized recommendations
- `POST /api/recommendations/generate` — Regenerate recommendations

### Chat
- `POST /api/chat/send` — Send message to AI assistant
- `GET /api/chat/history` — Get chat history

---

## 🎨 UI Pages

| Page | Route | Access |
|------|-------|--------|
| Landing | `/` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Student Dashboard | `/dashboard` | Student |
| Subjects | `/subjects` | Student |
| AI Notes | `/content` | Student |
| AI Quiz | `/quiz` | Student |
| Analytics | `/analytics` | Student |
| Recommendations | `/recommendations` | Student |
| AI Chat | `/chat` | Student |
| Profile | `/profile` | Student |
| Admin Dashboard | `/admin` | Admin |

---

## 🤝 Project Info

- **Project Title:** AI-Powered Personalised Learning Content and Quiz Generator
- **Domain:** B.Tech Computer Science
- **Purpose:** Educational technology platform demonstrating AI integration in learning systems

---

*Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI*
