"use client";

import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaStop,
  FaArrowRight,
  FaSignOutAlt,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useSpeechToText from "react-hook-speech-to-text";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { saveUserAnswerToDB } from "../_actions/saveUserAnswerToDB";
import { LogOut } from "lucide-react";

export default function AnswerSection({
  questions = [],
  currentQuestionIndex = 0,
  onNextQuestion,
  mockInterviewQuestions,
  activeQuestionsIndex,
  interviewData,
}) {
  const [webcamOn, setWebcamOn] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [transcriptDraft, setTranscriptDraft] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [startClicked, setStartClicked] = useState(false); // ✅ ADDED THIS LINE
  const { user } = useUser();
  const router = useRouter();

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    stopSpeechToText();
    setTranscriptDraft("");
  }, [currentQuestionIndex]);

  const SaveUserAnswer = () => {
    if (!webcamOn) {
      toast.error("Turn on webcam to answer.");
      return;
    }

    if (isRecording) {
      stopSpeechToText();
      const combined = results.map((r) => r.transcript).join(" ").trim();
      setTranscriptDraft(combined);
      setIsEditing(true);
      toast.success("Recording stopped. You can now edit or submit.");
    } else {
      startSpeechToText();
      setIsEditing(false);
      setTranscriptDraft("");
      toast.info("Recording started.");
    }
  };

  const handleSubmitAnswer = async () => {
    const transcript = transcriptDraft.trim();
    if (!transcript) {
      toast.error("No answer to submit.");
      return;
    }

    const currentQ = mockInterviewQuestions?.[activeQuestionsIndex]?.question || "";
    const correctA = mockInterviewQuestions?.[activeQuestionsIndex]?.answer || "";
    const mockId = interviewData?.mockId;

    const newAnswers = [...savedAnswers];
    newAnswers[currentQuestionIndex] = transcript;
    setSavedAnswers(newAnswers);
    toast.success("Answer saved!");

    try {
      const res = await fetch("/api/Feedback/generate-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQ,
          answer: transcript,
        }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error("Feedback error: " + data.error);
        return;
      }

      const newFeedbacks = [...feedbacks];
      newFeedbacks[currentQuestionIndex] = data;
      setFeedbacks(newFeedbacks);

      toast.success("Feedback received 🎉");
      toast.success(`Rating: ${data.rating}`);

      await saveUserAnswerToDB({
        mockId,
        question: currentQ,
        correctAnswer: correctA,
        userAnswer: transcript,
        feedback: data.feedback,
        rating: data.rating,
        userEmail: user?.emailAddresses?.[0]?.emailAddress ?? "anonymous",
      });

      toast.success("Answer saved in DB 🎉");
      setIsEditing(false);
    } catch (err) {
      console.error("API call failed or DB insert failed:", err);
      toast.error("Failed to get feedback or save answer.");
    }
  };

  const endInterview = () => {
    stopSpeechToText();
    toast.success("Interview ended!");
    router.push("/dashboard");
  };

  const currentQuestion = questions[currentQuestionIndex] || "No question available.";
  const fullTranscript = results.map((r) => r.transcript).join(" ");
  const savedAnswer = savedAnswers[currentQuestionIndex] || "";
  const currentFeedback = feedbacks[currentQuestionIndex];

  if (error) {
    return (
      <p className="text-red-500 text-center mt-6 font-semibold text-lg">
        Web Speech API is not available in this browser 🤷‍♂️
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 my-16 px-4 max-w-3xl mx-auto">
      {/* Webcam */}
      <div className="relative w-full max-w-lg rounded-xl overflow-hidden shadow-2xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/20 backdrop-blur-md">
        {!webcamOn ? (
          <div className="flex flex-col items-center justify-center gap-6 py-10 px-6">
            <Image
              src="/webcam.png"
              alt="webcam placeholder"
              width={280}
              height={280}
              className="rounded-lg shadow-lg"
            />
            <button
              onClick={() => setWebcamOn(true)}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-lg hover:from-green-500 hover:to-blue-600 transition-transform active:scale-95"
              type="button"
            >
              <FaVideo className="w-6 h-6" />
              Turn On Webcam
            </button>
          </div>
        ) : (
          <div className="relative">
            <Webcam
              mirrored
              audio={false}
              className="w-full aspect-[4/3] object-cover rounded-xl"
            />
            <button
              onClick={() => setWebcamOn(false)}
              className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition transform active:scale-95"
              type="button"
            >
              <FaVideoSlash className="w-5 h-5" />
              Off
            </button>
          </div>
        )}
      </div>

      {/* Record */}
      <Button
        variant="outline"
        onClick={SaveUserAnswer}
        className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold ${
          isRecording
            ? "text-red-600 border-red-600 hover:bg-red-100"
            : "text-green-600 border-green-600 hover:bg-green-100"
        } transition-all duration-200 shadow-md hover:shadow-lg active:scale-95`}
      >
        {isRecording ? (
          <>
            <FaStop className="w-4 h-4" />
            Stop Recording
          </>
        ) : (
          <>
            <FaMicrophone className="w-4 h-4" />
            Record Answer
          </>
        )}
      </Button>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <Button
          variant="solid"
          onClick={onNextQuestion}
          disabled={currentQuestionIndex >= questions.length - 1}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50"
        >
          Next Question <FaArrowRight className="w-5 h-5" />
        </Button>

        <Button
          size="lg"
          className={`group flex items-center gap-2 transition-all duration-200 rounded-2xl px-6 py-3 font-semibold shadow-xl ${
          startClicked
          ? "bg-red-400 text-white cursor-not-allowed"
          : "bg-red-600 hover:bg-bg-red-600 text-white"
          }`}
          disabled={!interviewData}
          onClick={() => {
            setStartClicked(true);
            router.push(`/dashboard/interView/${interviewData?.mockId}/feedback/`);
          }}
          >
          <LogOut className="w-5 h-5 transition-transform group-hover:rotate-[-5deg]" />
          End Interview
        </Button>
      </div>
      {/* Transcript */}
      <section className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Live Transcript</h2>

        {isEditing ? (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg resize-none min-h-[100px] font-medium text-gray-700"
            value={transcriptDraft}
            onChange={(e) => setTranscriptDraft(e.target.value)}
          />
        ) : (
          <p className="text-gray-700 min-h-[80px] whitespace-pre-wrap leading-relaxed">
            {fullTranscript || (
              <span className="italic text-gray-400">Your speech will appear here...</span>
            )}
            {interimResult && (
              <span className="italic text-gray-400"> {interimResult}</span>
            )}
          </p>
        )}

        {transcriptDraft && !isRecording && (
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditing((prev) => !prev)}
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              {isEditing ? "Cancel Edit" : "Edit"}
            </Button>
            <Button
              variant="solid"
              onClick={handleSubmitAnswer}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Submit
            </Button>
          </div>
        )}
      </section>

      {/* Saved Answer */}
      {savedAnswer && (
        <section className="w-full max-w-lg bg-green-50 border border-green-200 rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Saved Answer</h3>
          <p className="text-green-900 whitespace-pre-wrap">{savedAnswer}</p>
        </section>
      )}
    </div>
  );
}
