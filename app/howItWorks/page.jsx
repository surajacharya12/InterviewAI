import React from "react";
import { UserPlus, FileText, Rocket, MessageCircle } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <UserPlus className="w-10 h-10 text-indigo-600 mb-2" />,
      title: "Sign Up or Log In",
      description:
        "Create your InterviewAI account or log in securely using Clerk. Your data is safe and private.",
    },
    {
      icon: <FileText className="w-10 h-10 text-indigo-600 mb-2" />,
      title: "Generate Your Interview",
      description:
        "Enter your job role, description, and experience. Our AI instantly creates a tailored mock interview for you.",
    },
    {
      icon: <Rocket className="w-10 h-10 text-indigo-600 mb-2" />,
      title: "Practice in Real-Time",
      description:
        "Answer questions using your webcam and microphone. Experience a realistic interview environment.",
    },
    {
      icon: <MessageCircle className="w-10 h-10 text-indigo-600 mb-2" />,
      title: "Get Feedback & Improve",
      description:
        "Review your answers and get AI-powered feedback to sharpen your skills and boost your confidence.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-16 px-4">
      <section className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-4 drop-shadow-sm">
          How InterviewAI Works
        </h1>
        <p className="text-lg text-gray-700">
          Prepare for your next interview in four simple steps. Our platform uses AI to generate personalized mock interviews and feedback, helping you practice and succeed.
        </p>
      </section>
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 hover:shadow-2xl transition duration-300"
          >
            <div>{step.icon}</div>
            <h2 className="text-xl font-bold text-indigo-900 mb-2">{`${idx + 1}. ${step.title}`}</h2>
            <p className="text-gray-600 text-base">{step.description}</p>
          </div>
        ))}
      </section>
      <section className="max-w-2xl mx-auto mt-16 text-center">
        <h3 className="text-2xl font-semibold text-indigo-700 mb-2">Why InterviewAI?</h3>
        <p className="text-gray-700 text-base mb-4">
          No more guesswork or generic questions. InterviewAI gives you a safe space to practice, learn, and grow—so you can walk into your next interview with confidence.
        </p>
        <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium">
          Ready to get started? Sign up and try your first mock interview today!
        </span>
      </section>
    </main>
  );
}
