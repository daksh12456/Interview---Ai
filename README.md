# AI Interview Prep & Resume Strategy Generator

An AI-powered web application that helps candidates prepare for target job descriptions by analyzing their resumes, identifying skill gaps, generating custom interview roadmaps, and producing tailored PDF resumes.

---

## 🚀 Features

- **User Authentication**: Secure user registration and login powered by JWT (JSON Web Tokens) and Bcrypt hashing.
- **Resume Upload & Parsing**: Supports uploading **PDF** and **Word (DOCX)** resumes, parsing text directly on the server.
- **Custom Interview Plan Generation**: Analyzes candidate profiles against target job descriptions using **Google Gemini AI** to produce:
  - **Match Score**: Detailed compatibility score.
  - **Technical & Behavioral Questions**: Real interview questions with background intention and suggested answers.
  - **Skill Gaps**: List of missing skills with severity analysis (low/medium/high).
  - **Preparation Roadmap**: A structured day-by-day study plan.
- **Tailored Resume PDF Export**: Automatically designs and exports a tailored, ATS-friendly resume in PDF format using Puppeteer.
- **Offline Mock Mode**: Runs seamlessly out-of-the-box using mock fallbacks if no Gemini API key is configured.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vite + React
- **Router**: React Router v7
- **Styling**: Vanilla SCSS (Sass)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB (Mongoose ODM)
- **AI Processing**: `@google/genai` (Gemini 2.0 / 3.0 models)
- **Document Parsers**: `pdf-parse` (PDF) and `mammoth` (DOCX)
- **PDF Exporter**: Puppeteer (Headless Chrome)
- **Environment Management**: `dotenv`

---

## 📂 Project Structure

```text
interview-ai-yt-main/
│
├── Backend/
│   ├── src/
│   │   ├── config/          # DB connection configuration
│   │   ├── controllers/     # API route controllers
│   │   ├── middlewares/     # Authentication & Multer file middleware
│   │   ├── models/          # MongoDB schemas (User, InterviewReport, Blacklist)
│   │   ├── routes/          # API route definitions
│   │   └── services/        # AI logic & PDF generation services
│   ├── server.js            # Node server entry point (with DOMMatrix polyfill)
│   ├── .env                 # Environment variables configuration
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/        # Login/Registration flows, hooks, and context
│   │   │   └── interview/   # Homepage, dashboard, hooks, and services
│   │   ├── style/           # Global styles and SCSS mixins
│   │   ├── App.jsx          # App wrapper and entry layout
│   │   └── app.routes.jsx   # Client routing config
│   ├── index.html
│   └── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v20.14+ recommended)
- MongoDB running locally on `mongodb://localhost:27017`

### 1. Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables. The `.env` file should have the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/interview-ai
   JWT_SECRET=supersecretjwtkey123
   GOOGLE_GENAI_API_KEY=YOUR_GEMINI_API_KEY
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *The server runs on **http://localhost:3000**.*

### 2. Frontend Setup
1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will open on **http://localhost:5173**.*
