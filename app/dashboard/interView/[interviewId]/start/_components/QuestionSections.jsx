import React, { useEffect, useRef, useState } from "react";
import { User, Repeat } from "react-feather";

export default function QuestionSection({
  mockInterviewQuestions,
  activeQuestionsIndex,
  // onQuestionClick,  // Remove this prop as buttons are disabled now
}) {
  const activeQuestion =
    mockInterviewQuestions?.[activeQuestionsIndex]?.question || "No question text available.";

  const utteranceRef = useRef(null);
  const [typedText, setTypedText] = useState("");

  const speakQuestion = (text) => {
    if ("speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = "en-US";

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      speakQuestion(activeQuestion);
    }, 300);

    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.cancel();
    };
  }, [activeQuestion]);

  useEffect(() => {
    setTypedText("");
    if (!activeQuestion) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + activeQuestion[currentIndex]);
      currentIndex++;
      if (currentIndex >= activeQuestion.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [activeQuestion]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      {/* Question Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mockInterviewQuestions?.length > 0 ? (
          mockInterviewQuestions.map((_, index) => {
            const isActive = activeQuestionsIndex === index;

            return (
              <button
                key={index}
                disabled={true} // Disable button click
                className={`w-full px-4 py-2 rounded-xl text-sm font-semibold border
                  cursor-not-allowed select-none
                  ${
                    isActive
                      ? "bg-primary text-white shadow-lg ring-2 ring-primary/50 scale-105"
                      : "bg-muted text-muted-foreground dark:bg-gray-700 dark:text-gray-400"
                  }
                `}
                // no onClick handler, so no clicks possible
              >
                Question {index + 1}
              </button>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No questions available.
          </p>
        )}
      </div>

      {/* Video Call Style Container */}
      <div className="relative mx-auto w-full max-w-xl aspect-video rounded-2xl bg-black overflow-hidden shadow-lg border-4 border-primary/30 flex items-center justify-center">
        {/* Simulated video avatar */}
        <User className="w-24 h-24 text-white" />
      </div>

      {/* Active Question Text & Repeat Button */}
      <div className="w-full p-6 border rounded-2xl bg-white dark:bg-gray-900 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Question {activeQuestionsIndex + 1}
          </h2>
          <button
            onClick={() => speakQuestion(activeQuestion)}
            aria-label="Repeat Question"
            className="flex items-center space-x-1 text-primary hover:text-primary-dark transition-colors"
          >
            <Repeat className="w-5 h-5" />
            <span className="text-sm font-medium">Repeat</span>
          </button>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
          {activeQuestion}
        </p>
      </div>
    </div>
  );
}
