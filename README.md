# PlaceMentor AI 🎓🤖
> **An AI-Powered Placement and Career Assistant for University Students**  
> Tailored for University of Hyderabad (**`@uohyd.ac.in`**) campus placements.

---

## 1. Project Overview

**PlaceMentor AI** is a production-ready, full-stack web application engineered to guide university students through the rigorous campus placement and off-campus recruitment cycle. It provides real-time AI placement mentorship, deep resume parsing & ATS scoring, target company alignment, and intelligent job description decomposition.

Designed with a modern, responsive ChatGPT-inspired UI, PlaceMentor AI strictly enforces placement-only guardrails to keep students focused on high-yield technical preparation, DSA patterns, HR behavioral questions, and resume optimization.

---

## 2. Key Features

- **University of Hyderabad Student Authentication**:
  - Secure registration strictly restricted to `@uohyd.ac.in` emails with regex enforcement on both frontend and backend (`^[A-Za-z0-9._%+-]+@uohyd\.ac\.in$`).
  - Student profile captures degree program, department, graduation year, tech skills, preferred placement domain, and experience level.
  - Secure password hashing with bcrypt (10 rounds) and JWT authentication with session persistence.

- **Placement-Only AI Assistant**:
  - Chat interface inspired by modern AI apps (Today, Yesterday, 7 Days, Older grouping, search filtering, inline rename, delete confirmation).
  - Enforced placement persona focusing exclusively on tech rounds, DSA, CS fundamentals (OS, DBMS, CN, OOPS), HR STAR frameworks, and company hiring trends.
  - Graceful off-topic handling: politely redirects general queries back to placement preparation.
  - Markdown rendering with code blocks, syntax highlighting, copy responses, and regenerate capabilities.

- **Dedicated Resume & ATS Analyzer**:
  - Supports **PDF, JPG, JPEG, and PNG** formats up to 10MB.
  - Automatic PDF text extraction (`pdf-parse`) and local OCR extraction (`tesseract.js`).
  - Calculates **Overall Resume Score (0-100)** and **ATS Compatibility Score (0-100)**.
  - Detailed diagnostic reports: Strengths, Weaknesses, Skills Analysis, Project Depth, Education, Experience, Formatting Issues, and ATS issues.
  - **Actionable Bullet Improvements**: Rewrites weak resume bullet points into quantifiable statements using Google's XYZ formula (*"Accomplished [X], measured by [Y], by doing [Z]"*).

- **Target Company & Role Alignment**:
  - Compare uploaded resumes against specific target companies and roles (e.g. *Micron - IT Employee Experience Engineering*, *Oracle SDE*, etc.).
  - Generates Role Match %, Matching vs Missing Skills, Relevant vs Irrelevant sections, and role-specific interview questions.

- **My Resumes & Version History**:
  - Persistent repository of student resume iterations.
  - Side-by-side comparison modal to track score changes across resume updates.

- **Job Description (JD) Analyzer**:
  - Paste any campus circular or JD to extract required vs preferred skills, frameworks, cloud tools, likely interview topics, and a step-by-step preparation roadmap.

- **University Placement Vault**:
  - Curated guide for UoH students covering core CS fundamentals (OS, DBMS, CN, OOPS), structured DSA phases, and HR STAR behavioral questions.

- **Pluggable AI Architecture**:
  - Decoupled provider layer supporting **Google Gemini** (`gemini-1.5-flash`) and **Groq** (`llama-3.3-70b-versatile`).
  - Seamlessly switch between AI providers via `.env` without modifying application code.

---

## 3. Technology Stack

### Frontend
- **Framework**: React.js (v18) with Vite
- **Styling**: Tailwind CSS with custom slate/teal career theme
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **Networking**: Axios (with JWT interceptors)
- **Rendering**: React Markdown, Remark GFM, Canvas Confetti

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database ORM**: Prisma ORM (v6)
- **Database**: PostgreSQL (with SQLite zero-config dev fallback)
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **File Uploads**: Multer
- **Resume Extraction**: `pdf-parse` (PDF) + `tesseract.js` (OCR for Images)
- **AI SDKs**: `@google/generative-ai` (Gemini) + `groq-sdk` (Groq/Llama)

---

## 4. Folder Structure

```
placeMentor-ai/
│
├── client/                     # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Modal, Toast, Skeleton, ProtectedRoute
│   │   │   ├── chat/           # ChatSidebar, ChatMessage, ChatInput, ChatWelcome
│   │   │   └── resume/         # ResumeUploader, ScoreCard, RoleMatchCard
│   │   ├── pages/              # Login, Register, Dashboard, Chat, Resumes, JD, Resources, Profile
│   │   ├── context/            # AuthContext, ChatContext, ToastContext
│   │   ├── services/           # Axios API client
│   │   ├── utils/              # Date formatting & chat grouping
│   │   ├── App.jsx             # React Router routing setup
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Global typography & markdown styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                     # Express.js Backend
│   ├── prisma/
│   │   ├── schema.prisma       # PostgreSQL schema (Production)
│   │   └── schema.sqlite.prisma# SQLite schema (Instant Local Dev)
│   ├── uploads/
│   │   └── resumes/            # Secure upload storage
│   ├── src/
│   │   ├── config/             # Environment variable loader
│   │   ├── controllers/        # Auth, Chat, Resume, JD, Profile controllers
│   │   ├── middleware/         # JWT Auth, Multer, Error handlers
│   │   ├── routes/             # Express API routes
│   │   ├── services/
│   │   │   ├── ai/             # Pluggable AI: Gemini & Groq providers + system prompts
│   │   │   ├── resumeParser.js # PDF & Tesseract OCR extractor
│   │   │   └── prismaClient.js # Prisma client singleton
│   │   ├── utils/              # Validators (UoH regex, email, payload checks)
│   │   └── server.js           # Express app entry point
│   ├── .env                    # Server environment variables
│   └── package.json
│
├── .env.example                # Template configuration
├── .gitignore
├── package.json                # Root developer scripts
└── README.md                   # Full documentation
```

---

## 5. Prerequisites

- **Node.js**: v18 or higher (tested on Node v24)
- **npm**: v9 or higher
- **PostgreSQL**: Optional for production (PostgreSQL 14+); SQLite dev database works out of the box.

---

## 6. PostgreSQL Setup

1. Make sure your PostgreSQL server is running.
2. Create a database for PlaceMentor AI:
   ```sql
   CREATE DATABASE placementor_db;
   ```
3. In `server/.env`, set your connection string:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/placementor_db?schema=public"
   ```

*(Note: If you do not have PostgreSQL installed yet, PlaceMentor AI comes pre-configured with a zero-setup SQLite database file `dev.db` so you can start developing immediately).*

---

## 7. Environment Variables

Create or update `server/.env`:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection
# PostgreSQL:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/placementor_db?schema=public"
# Or SQLite:
# DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET=placementor_uohyd_secret_jwt_key_2025
JWT_EXPIRES_IN=7d

# File Upload Limits
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=uploads/resumes

# AI Provider Selection: "gemini" or "groq"
AI_PROVIDER=gemini

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Groq Configuration (Alternative)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

---

## 8. AI API Key Configuration

### Option A: Google Gemini (Default)
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key** and generate a free API key.
3. Add to `server/.env`:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-1.5-flash
   ```

### Option B: Groq / Llama
1. Sign up at [Groq Console](https://console.groq.com/).
2. Create an API key.
3. Add to `server/.env`:
   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=gsk_...
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

*If no key is configured yet, the server will not crash; it will provide a friendly setup notice in the chat explaining how to add your key.*

---

## 9. Prisma Setup & Database Migration

To generate the Prisma client and push your schema to the database:

### For PostgreSQL:
```bash
cd server
npx prisma generate --schema=prisma/schema.prisma
npx prisma db push --schema=prisma/schema.prisma
```

### For SQLite (Instant Local Dev):
```bash
cd server
npm run prisma:generate:sqlite
npm run db:push:sqlite
```

---

## 10. How to Start the Application

Open two terminal windows:

### Terminal 1 — Backend Server
```bash
cd server
npm run dev
```
Backend will start on `http://localhost:5000`.

### Terminal 2 — Frontend Client
```bash
cd client
npm run dev
```
Frontend will start on `http://localhost:5173`.

Alternatively, from the project root:
```bash
npm run dev:server    # Starts backend
npm run dev:client    # Starts frontend
```

---

## 11. How to Use PlaceMentor AI

1. **Register**: Navigate to `http://localhost:5173/register` and register using your university email (e.g. `23mcmc01@uohyd.ac.in`).
2. **Dashboard**: Access quick action prompts (DSA questions, technical interview prep, HR STAR prep).
3. **AI Chat**: Start a placement conversation. Notice the automatic chat titling, code syntax highlighting, and persistent history grouped by Today, Yesterday, and Previous 7 Days.
4. **Resume Analyzer**:
   - Upload your resume (`.pdf`, `.png`, `.jpg`, or `.jpeg`).
   - (Optional) Enter Target Company (e.g. `Micron`) and Job Description.
   - Click **Run Complete Resume & ATS Analysis**.
   - Review overall score, ATS parse score, rewritten bullet points, and role alignment.
5. **My Resumes**: View past resume scores and compare 2 versions side-by-side.
6. **Job Description Analyzer**: Paste any company circular to receive tech stack breakdowns and customized study roadmaps.

---

## 12. Switching AI Providers

PlaceMentor AI makes switching LLM providers painless:
1. Open `server/.env`.
2. Change `AI_PROVIDER=gemini` to `AI_PROVIDER=groq` (or vice versa).
3. Ensure the corresponding key (`GEMINI_API_KEY` or `GROQ_API_KEY`) is populated.
4. Restart your backend server (`npm run dev`).
5. Check your active provider status directly under **Student Profile & Settings** in the app.

---

## 13. Troubleshooting

- **Error: "Please use your University of Hyderabad email address ending with @uohyd.ac.in."**:
  - The application strictly requires emails ending in `@uohyd.ac.in`. Please verify your email format.
- **Error: "the URL must start with the protocol postgresql:// or postgres://"**:
  - Ensure `DATABASE_URL` in `server/.env` starts with `postgresql://`. If running locally with SQLite, use `npm run db:push:sqlite`.
- **AI Response: "PlaceMentor AI Setup Notice"**:
  - Make sure your `GEMINI_API_KEY` or `GROQ_API_KEY` is saved in `server/.env` and restart the backend server.
- **Image OCR extraction takes a few seconds**:
  - Tesseract OCR downloads language models on the first run; subsequent runs are faster.

---

## 14. License

PlaceMentor AI is developed for university students and academic placement preparation. Licensed under the MIT License.
