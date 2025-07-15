# <img src="public/logo.png" alt="InterviewAI Logo" width="48" height="48" style="vertical-align:middle; margin-right:8px;"/> InterviewAI

[![GitHub stars](https://img.shields.io/github/stars/yourusername/interviewai?style=social)](https://github.com/yourusername/interviewai/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/interviewai)](https://github.com/yourusername/interviewai/issues)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A modern, open-source AI-powered platform for generating mock interview questions and answers tailored to job roles, descriptions, and experience levels.

---

## 🚀 Features

- Generate interview questions and answers using Google Gemini AI
- Customizable by job role, description, and experience
- Beautiful, modern UI with React and Tailwind CSS
- Secure backend API integration (no API keys exposed to frontend)
- Easy extensibility for new features
- Built with Next.js App Router and Drizzle ORM
- **User authentication and onboarding with Clerk**
- **Direct navigation to generated interview details**

## 🛠️ Getting Started

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
NEXT_PUBLIC_INFORMATION="Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. It Has 5 question which you can answer. NOTE:We never record your interview Video. Web Cam access you can disable at any time if you want"
```

> **Hint:** Never commit your real API keys or secrets to version control. Always use environment variables for sensitive information.

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📁 Project Structure

- `app/` - Next.js app directory (pages, API routes, UI)
- `components/` - Reusable UI components
- `utils/` - Database and AI integration utilities
- `public/` - Static assets (including logo)

---

## 🔐 User Authentication & Onboarding

- Authentication is handled by [Clerk](https://clerk.com/). Users sign in or sign up using Clerk's UI.
- On first login, the app automatically creates a user record in the database by calling the `/api/user` endpoint with the user's name and email.
- The user context is available throughout the app for personalized features.

---

## 🤖 Interview Generation & Navigation

- Users can generate a mock interview by providing job role, description, and experience.
- The backend API (`/api/generate-interview`) generates questions and stores the interview in the database.
- **API Response:**
  - On success, the API returns:
    ```json
    {
      "success": true,
      "result": {
        /* questions & answers */
      },
      "mockId": "<interviewId>"
    }
    ```
  - The frontend automatically navigates to `/dashboard/interView/<interviewId>` after a successful generation, where users can view their generated interview.

---

## 🤝 Contributing

We welcome contributions from everyone! Whether you're fixing bugs, adding new features, improving documentation, or sharing ideas, your input is highly valued.

- Fork the repository and create your branch
- Make your changes and submit a pull request
- Please ensure your code follows the project's style and passes all checks

If you have suggestions for improvements or want to discuss new features, feel free to open an issue. Let's build something amazing together!

---

## 📄 License

MIT — Free to use, modify, and distribute. See [LICENSE](LICENSE) for details.
