"use client";

import React from "react";
import {
  Brain,
  Target,
  BarChart3,
  Mic,
  Video,
  ArrowRight,
  UserPlus,
  FileText,
  Rocket,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MiddleSection() {
  const router = useRouter();

  const howItWorksSteps = [
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-6 leading-tight">
          Master Your Next Interview with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
            AI-Powered Practice
          </span>
        </h1>
        <p className="text-xl text-gray-700 mb-10 max-w-xl mx-auto leading-relaxed">
          Get personalized feedback, practice with industry-specific questions,
          and build confidence with our advanced AI interviewer that adapts to
          your experience level.
        </p>
        <button
          className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition flex items-center justify-center gap-2"
          onClick={() => router.push("/dashboard")}
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 py-20 px-4">
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 text-center">
          <div className="bg-indigo-100 rounded-full p-4 mb-4">
            <Brain className="h-10 w-10 text-indigo-700" />
          </div>
          <h2 className="text-xl font-bold text-indigo-900 mb-2">
            AI-Powered Analysis
          </h2>
          <p className="text-gray-600 text-base">
            Advanced AI evaluates your responses in real-time, providing
            detailed feedback on content, delivery, and areas for improvement.
          </p>
        </div>
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 text-center">
          <div className="bg-purple-100 rounded-full p-4 mb-4">
            <Target className="h-10 w-10 text-purple-700" />
          </div>
          <h2 className="text-xl font-bold text-indigo-900 mb-2">
            Industry-Specific Questions
          </h2>
          <p className="text-gray-600 text-base">
            Practice with questions tailored to your industry, role, and
            experience level. From tech to healthcare, we've got you covered.
          </p>
        </div>
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 text-center">
          <div className="bg-green-100 rounded-full p-4 mb-4">
            <BarChart3 className="h-10 w-10 text-green-700" />
          </div>
          <h2 className="text-xl font-bold text-indigo-900 mb-2">
            Performance Tracking
          </h2>
          <p className="text-gray-600 text-base">
            Monitor your progress with detailed analytics and personalized
            improvement recommendations to boost your confidence.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <section className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-extrabold text-indigo-800 mb-4 drop-shadow-sm">
            How InterviewAI Works
          </h2>
          <p className="text-lg text-gray-700">
            Prepare for your next interview in four simple steps. Our platform
            uses AI to generate personalized mock interviews and feedback,
            helping you practice and succeed.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {howItWorksSteps.map((step, idx) => (
            <div
              key={step.title}
              className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 hover:shadow-2xl transition duration-300"
            >
              <div>{step.icon}</div>
              <h3 className="text-xl font-bold text-indigo-900 mb-2">
                {`${idx + 1}. ${step.title}`}
              </h3>
              <p className="text-gray-600 text-base">{step.description}</p>
            </div>
          ))}
        </div>

        <section className="max-w-2xl mx-auto mt-16 text-center">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-2">
            Why InterviewAI?
          </h3>
          <p className="text-gray-700 text-base mb-4">
            No more guesswork or generic questions. InterviewAI gives you a
            safe space to practice, learn, and grow—so you can walk into your
            next interview with confidence.
          </p>
          <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium">
            Ready to get started? Sign up and try your first mock interview
            today!
          </span>
        </section>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-indigo-900 text-center mb-12">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              name: "Sarah Mitchell",
              role: "Software Engineer",
              initials: "SM",
              color: "bg-indigo-100 text-indigo-700",
              quote:
                '"InterviewAI helped me identify my weak points and practice until I felt confident. I landed my dream job at a Fortune 500 company!"',
            },
            {
              name: "Michael Chen",
              role: "Product Manager",
              initials: "MC",
              color: "bg-purple-100 text-purple-700",
              quote:
                '"The AI feedback was incredibly detailed and actionable. I improved my interview skills dramatically and got multiple job offers."',
            },
            {
              name: "Emily Johnson",
              role: "Marketing Specialist",
              initials: "EJ",
              color: "bg-green-100 text-green-700",
              quote:
                '"As a recent graduate, I was nervous about interviews. InterviewAI gave me the confidence and skills I needed to succeed."',
            },
          ].map(({ name, role, initials, color, quote }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100"
            >
              <div className="flex items-center mb-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold text-lg ${color} mr-4`}
                >
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-indigo-900">{name}</p>
                  <p className="text-gray-600 text-sm">{role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">“{quote}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-indigo-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10K+", label: "Successful Interviews" },
            { value: "95%", label: "Success Rate" },
            { value: "500+", label: "Companies" },
            { value: "4.9/5", label: "User Rating" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-4xl font-extrabold mb-2">{value}</div>
              <div className="text-indigo-200">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-lg text-gray-700 mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of professionals who've transformed their interview
            skills with InterviewAI
          </p>
        </div>
      </section>

      {/* Footer - Copyright */}
      <footer className="bg-indigo-900 text-indigo-200 py-6 mt-auto text-center">
        &copy; {new Date().getFullYear()} InterviewAI. All rights reserved.
      </footer>
    </main>
  );
}
