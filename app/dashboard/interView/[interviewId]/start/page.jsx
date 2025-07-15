"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuestionSection from "./_components/QuestionSections";
import AnswerSection from "./_components/answerSection";

export default function StartInterviewPage() {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionsIndex, setActiveQuestionsIndex] = useState(0);

  useEffect(() => {
    if (!interviewId) return;

    const GetInterViewDetails = async () => {
      try {
        const res = await fetch(`/api/interview/${interviewId}/questions/`);
        if (!res.ok) {
          console.log("No interview data found");
          return;
        }

        const data = await res.json();
        console.log("Interview API response:", data);

        // Normalize response to always be an array of questions
        const normalizedQuestions = Array.isArray(data)
          ? data
          : Array.isArray(data?.jsonMockResp)
          ? data.jsonMockResp
          : Array.isArray(data?.interview_questions)
          ? data.interview_questions
          : [];

        setMockInterviewQuestions(normalizedQuestions);
        setInterviewData(data);
      } catch (error) {
        console.error("Error fetching interview details:", error);
      }
    };

    GetInterViewDetails();
  }, [interviewId]);

  const handleNextQuestion = () => {
    setActiveQuestionsIndex((current) => {
      if (current < mockInterviewQuestions.length - 1) {
        return current + 1;
      }
      return current;
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-6 md:px-12 pl-15">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">
          Interview Question Navigator
        </h1>
        <p className="mt-3 text-lg text-indigo-700">
          Use the &quot;<span className="font-semibold text-indigo-600">Next Question</span>&quot; button to proceed. <br />
          Once you advance, going back is disabled to keep your flow uninterrupted.
        </p>
      </header>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Question Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-xl font-semibold text-indigo-900 mb-6 select-none">
            Questions
          </h2>
          <QuestionSection
            mockInterviewQuestions={mockInterviewQuestions}
            activeQuestionsIndex={activeQuestionsIndex}
          />
        </div>

        {/* Answer Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-indigo-100 flex flex-col">
          <AnswerSection
            questions={mockInterviewQuestions.map((q) => q.question)}
            currentQuestionIndex={activeQuestionsIndex}
            onNextQuestion={handleNextQuestion}
            mockInterviewQuestions={mockInterviewQuestions}
            activeQuestionsIndex={activeQuestionsIndex}
            interviewData={interviewData}
          />
        </div>
      </section>
    </main>
  );
}
