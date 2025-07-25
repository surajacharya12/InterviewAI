"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function MyGivenInterviews() {
  const { interviewId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    async function fetchInterviews() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/InterviewApi/mytakeninterview");
        if (!res.ok) {
          throw new Error("Failed to fetch interviews");
        }
        const data = await res.json();
        setInterviews(data);
      } catch (err) {
        setError(err.message || "Unknown error");
        toast.error(err.message || "Failed to fetch interviews");
      } finally {
        setLoading(false);
      }
    }

    fetchInterviews();
  }, []);

  function handleStartInterview(mock) {
    router.push(`/dashboard/interView/${mock.mockId}`);
  }

  function handleFeedback(mock) {
    router.push(`/dashboard/interView/${mock.mockId}/feedback/`);
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="mt-12 max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Your Given Interviews
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-24" />
              </div>
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-16">
            You haven’t created or enrolled in any interviews yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {interviews.map((mock) => (
              <div
                key={mock.mockId}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xl font-semibold text-blue-700 mb-2">
                    {mock.jobPosition}
                  </h4>
                  <p
                    className="text-gray-700 mb-1 truncate"
                    title={mock.jobDesc}
                  >
                    {mock.jobDesc}
                  </p>
                  <p className="text-gray-500 text-sm mb-1">
                    <strong>Experience:</strong> {mock.jobExperience} years
                  </p>
                  <p
                    className="text-gray-400 text-xs mb-1 truncate"
                    title={mock.createdBy}
                  >
                    <strong>Created By:</strong> {mock.createdBy}
                  </p>
                  <p className="text-gray-400 text-xs mb-4">
                    <strong>Created At:</strong> {mock.createdAt}
                  </p>
                </div>

                <div className="mt-auto flex gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-[150px] flex items-center justify-center gap-2 transition hover:bg-indigo-600 hover:text-white"
                    onClick={() => handleStartInterview(mock)}
                  >
                    <Play className="w-5 h-5" />
                    Retake Interview
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-[150px] flex items-center justify-center gap-2 transition hover:bg-green-600 hover:text-white"
                    onClick={() => handleFeedback(mock)}
                  >
                    Feedback
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
