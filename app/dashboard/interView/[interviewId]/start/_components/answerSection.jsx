"use client";

import React, { useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { FaVideo, FaVideoSlash, FaMicrophone, FaStop, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useSpeechToText from "react-hook-speech-to-text";

function AnswerSection({ 
  questions = [], 
  currentQuestionIndex = 0, 
  onNextQuestion 
}) {
  const [webcamOn, setWebcamOn] = React.useState(false);

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

  const handleRecordClick = () => {
    if (!webcamOn) {
      toast.error("Please turn on your webcam before starting to record.");
      return;
    }

    if (isRecording) {
      stopSpeechToText();
      toast.success("Recording stopped.");
    } else {
      startSpeechToText();
      toast.success("Recording started.");
    }
  };

  // Stop recording if question changes
  useEffect(() => {
    if (isRecording) stopSpeechToText();
  }, [currentQuestionIndex, isRecording, stopSpeechToText]);

  if (error) {
    return (
      <p className="text-red-500 text-center mt-4 font-semibold text-lg">
        Web Speech API is not available in this browser 🤷‍♂️
      </p>
    );
  }

  const currentQuestion = questions[currentQuestionIndex] || "No question available.";
  const fullTranscript = results.map((r) => r.transcript).join(" ");

  return (
    <div className="flex flex-col items-center gap-8 my-16 px-4 max-w-3xl mx-auto">
      {/* Webcam or Placeholder Container */}
      <div
        className={`relative w-full max-w-lg rounded-xl overflow-hidden shadow-2xl 
          bg-gradient-to-tr from-white/10 to-white/5 border border-white/20
          backdrop-blur-md`}
      >
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
              className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-lg
                hover:from-green-500 hover:to-blue-600 transition-transform active:scale-95"
              aria-label="Turn On Webcam"
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
              className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 bg-opacity-90 text-white shadow-lg hover:bg-red-700 transition transform active:scale-95"
              aria-label="Turn Off Webcam"
              type="button"
            >
              <FaVideoSlash className="w-5 h-5" />
              Off
            </button>
          </div>
        )}
      </div>

      {/* Record Button */}
      <Button
        variant="outline"
        onClick={handleRecordClick}
        className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold
          ${
            isRecording
              ? "text-red-600 border-red-600 hover:bg-red-100 active:bg-red-200"
              : "text-green-600 border-green-600 hover:bg-green-100 active:bg-green-200"
          } transition-all duration-200 shadow-md hover:shadow-lg active:scale-95`}
        aria-pressed={isRecording}
      >
        {isRecording ? (
          <>
            <FaStop className="w-5 h-5" />
            Stop Recording
          </>
        ) : (
          <>
            <FaMicrophone className="w-5 h-5" />
            Record Answer
          </>
        )}
      </Button>

         {/* Next Question Button */}
      <Button
        variant="solid"
        onClick={onNextQuestion}
        disabled={currentQuestionIndex >= questions.length - 1}
        className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Next Question"
      >
        Next Question <FaArrowRight className="w-5 h-5" />
      </Button>
      
      {/* Transcript Section */}
      <section
        aria-live="polite"
        className="w-full max-w-lg bg-white/90 rounded-xl border border-gray-300 shadow-lg p-6
          text-gray-900 min-h-[140px] max-h-64 overflow-y-auto whitespace-pre-wrap"
      >
        <h2 className="text-xl font-semibold mb-3 select-none">Transcript</h2>
        <p className="leading-relaxed min-h-[80px]">
          {fullTranscript || (
            <span className="italic text-gray-500 select-none">
              Your speech transcript will appear here...
            </span>
          )}
          {interimResult && (
            <span className="italic text-gray-400 select-none">
              {" "}
              {interimResult}
            </span>
          )}
        </p>
      </section>

     
    </div>
  );
}

export default AnswerSection;
