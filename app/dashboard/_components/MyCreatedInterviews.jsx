"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";

export default function MyCreatedInterviews() {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetch(`/api/InterviewApi/user-interviews`)
        .then((res) => res.json())
        .then((data) => {
          setInterviews(data.data || []);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load your interviews.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const handleStartInterview = async (mock) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    const interviewData = {
      mockId: mock.mockId,
      createdBy: user.emailAddresses?.[0]?.emailAddress || user.id,
      createdAt: new Date().toISOString(),
      jobPosition: mock.jobPosition,
      jobDesc: mock.jobDesc,
      jobExperience: mock.jobExperience,
    };

    try {
      const res = await fetch("/api/InterviewApi/mytakeninterview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interviewData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save interview");
      }

      toast.success("Interview saved, redirecting...");
      router.push(`/dashboard/interView/${mock.mockId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start interview.");
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="mt-12 max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Your Interviews
        </h3>

        {isLoading ? (
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
                  <p className="text-gray-700 mb-1 truncate" title={mock.jobDesc}>
                    {mock.jobDesc}
                  </p>
                  <p className="text-gray-500 text-sm mb-1">
                    <strong>Experience:</strong> {mock.jobExperience} years
                  </p>
                  <p className="text-gray-400 text-xs mb-1 truncate" title={mock.createdBy}>
                    <strong>Created By:</strong> {mock.createdBy}
                  </p>
                  <p className="text-gray-400 text-xs mb-4">
                    <strong>Created At:</strong> {mock.createdAt}
                  </p>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-[320px] mt-auto flex items-center justify-center gap-2 transition hover:bg-indigo-600 hover:text-white"
                  onClick={() => handleStartInterview(mock)}
                >
                  <Play className="w-5 h-5" />
                  Start Interview
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
