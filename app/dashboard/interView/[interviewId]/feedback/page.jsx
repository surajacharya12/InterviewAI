"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

export default function FeedbackPage() {
  const { interviewId } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("/api/Feedback/get-user-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mockId: interviewId,
            email: user?.emailAddresses?.[0]?.emailAddress ?? "anonymous",
          }),
        });

        const data = await res.json();
        if (data.success) {
          setFeedbacks(data.data);
        } else {
          setError(data.error || "Failed to fetch feedback.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong while fetching feedback.");
      } finally {
        setLoading(false);
      }
    };

    if (interviewId && user) {
      fetchFeedback();
    }
  }, [interviewId, user]);

  const averageRating = (() => {
    if (feedbacks.length === 0) return "0.0";

    const sum = feedbacks.reduce(
      (acc, item) => acc + (parseFloat(item.rating) || 0),
      0
    );

    const avg = sum / feedbacks.length;
    return avg.toFixed(1);
  })();

  const overallFeedback = feedbacks
    .map((f) => f.feedback)
    .filter(Boolean)
    .join(" ");

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center mt-20 text-red-600">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-white rounded-3xl shadow-2xl mt-10 border border-gray-200">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
        🎉 Congratulations!
      </h2>
      <p className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
        Here's your personalized interview feedback
      </p>

      <p className="text-gray-600 mb-6 text-lg">
        Overall Rating:{" "}
        <span className="text-blue-600 font-bold text-xl">{averageRating}/10</span>
      </p>

      {overallFeedback && (
        <div className="bg-yellow-100/80 border border-yellow-300 rounded-2xl shadow-sm p-5 mb-10 transition-all duration-300">
          <h3 className="text-xl font-bold text-yellow-800 mb-2">
            📝 Overall Feedback Summary:
          </h3>
          <p className="text-yellow-900 leading-relaxed tracking-wide">
            {overallFeedback}
          </p>
        </div>
      )}

      <p className="text-base text-gray-700 leading-relaxed mb-8">
        Below are the interview questions, model answers, your responses, and feedback to help you improve:
      </p>

      <Accordion
        type="single"
        collapsible
        className="space-y-4 transition-all duration-500"
      >
        {feedbacks.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-gray-300 rounded-xl shadow hover:shadow-md transition-shadow duration-300"
          >
            <AccordionTrigger className="text-left px-5 py-4 text-lg font-semibold text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200">
              Q{index + 1}: {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-5 py-4 text-gray-700 space-y-3 bg-gray-50 rounded-b-xl">

            <div className="bg-green-100/80 border border-green-300 rounded-2xl shadow-sm p-5 mb-10 transition-all duration-300">
              <p>
                <span className="font-medium text-gray-900">✅ Correct Answer:</span>{" "}
                {item.correctanswer}
              </p>
            </div>
              <div className="bg-red-100/80 border border-red-300 rounded-2xl shadow-sm p-5 mb-10 transition-all duration-300">
              <p>
                <span className="font-medium text-gray-900">🧠 Your Answer:</span>{" "}
                {item.useranswer}
              </p>
              </div>
              <div className="bg-yellow-100/80 border border-yellow-300 rounded-2xl shadow-sm p-5 mb-10 transition-all duration-300">
              <p>
                <span className="font-medium text-gray-900">💬 Feedback:</span>{" "}
                {item.feedback}
              </p>
              </div>
              <p>
                <span className="font-medium text-gray-900">⭐ Rating:</span>{" "}
                <span className="text-blue-600 font-semibold">{item.rating}</span>
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Dashboard Button */}
      <div className="mt-10 flex justify-center">
        <Button
          variant="solid"
          onClick={() => router.push("/dashboard")}
          className="px-8 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md transition"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
