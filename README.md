# <img src="public/logo.png" alt="InterviewAI Logo" width="48" height="48" style="vertical-align:middle; margin-right:8px;"/> InterviewAI

A modern AI-powered platform for generating mock interview questions and answers tailored to job roles, descriptions, and experience levels.

---

## Features

- Generate interview questions and answers using Google Gemini AI
- Customizable by job role, description, and experience
- Beautiful, modern UI with React and Tailwind CSS
- Secure backend API integration (no API keys exposed to frontend)
- Easy extensibility for new features

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/interviewai.git
cd interviewai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the following (replace values with your own):

```env
DATABASE_URL=YOUR_NEON_DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT=
```

> **Hint:** Never commit your real API keys or secrets to version control. Always use environment variables for sensitive information.

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## Project Structure

- `app/` - Next.js app directory (pages, API routes, UI)
- `components/` - Reusable UI components
- `utils/` - Database and AI integration utilities
- `public/` - Static assets (including logo)

---

## License

MIT
