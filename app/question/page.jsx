"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, FileText, PlusCircle, Rocket, XCircle } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function InterviewQuestionList() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedInterviews, setSavedInterviews] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [clickedMockId, setClickedMockId] = useState(null);

  // Fetch filtered interviews based on search
  const fetchAllInterviews = async (searchTerm = "") => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/InterviewApi/interview-questions";
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to fetch saved interviews");
        setSavedInterviews([]);
      } else {
        setSavedInterviews(data.data || []);
      }
    } catch (err) {
      setError(err.message || "Unexpected error");
      setSavedInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInterviews();
  }, []);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAllInterviews(search);
  };

  // Handle new interview questions generation submit inside dialog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const jobRole = form.jobRole.value.trim();
    const jobDescription = form.jobDescription.value.trim();
    const questionCount = form.questionCount.value.trim() || "10";

    try {
      const res = await fetch("/api/past-interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRole,
          jobDescription,
          questionCount: Number(questionCount),
        }),
      });

      const genData = await res.json();

      if (!res.ok || !genData.success) {
        toast.error(genData.error || "Generation failed");
        setLoading(false);
        return;
      }

      if (!genData.mockId) {
        toast.error("Invalid mockId returned");
        setLoading(false);
        return;
      }

      await fetchAllInterviews();

      toast.success("Interview questions generated successfully!");
      setOpen(false);
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      <div className="min-h-screen bg-gradient-to-br px-4 py-8">
        {/* Header & Search & Add Button */}
        <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700 drop-shadow-md flex items-center gap-3 justify-center sm:justify-start">
              <FileText className="w-10 h-10" />
              Your AI-Generated Interview Questions.
              </h1>
            <p className="text-base md:text-lg text-gray-600 mt-2 max-w-xl">
            Browse and search your AI-generated interview questions to prepare effectively for upcoming interviews.
            </p>
          </div>

          <div className="flex gap-4 justify-center sm:justify-end w-full sm:w-auto">
            <form onSubmit={handleSearch} className="relative w-full sm:w-[300px]">
              <Input
                type="text"
                placeholder="Search by job role or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-12"
              />
              <Button
                size="sm"
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Add New Interview Dialog Trigger */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="default"
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add New Questions
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Tell us more about your interview
                  </DialogTitle>
                  <DialogDescription className="mb-4">
                    Add details about your job position, job description, and number
                    of questions to generate.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Job Role / Position
                    </label>
                    <Input
                      name="jobRole"
                      type="text"
                      placeholder="e.g. Software Engineer"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Job Description
                    </label>
                    <Textarea
                      name="jobDescription"
                      placeholder="e.g. Build scalable web apps using React and Node.js"
                      rows={4}
                      className="resize-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Number of Questions
                    </label>
                    <Input
                      name="questionCount"
                      type="number"
                      min="1"
                      max="20"
                      placeholder="e.g. 10"
                      defaultValue={10}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setOpen(false)}
                      disabled={loading}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      <Rocket className="w-4 h-4 mr-2" />
                      {loading ? "Generating..." : "Generate Interview"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Interviews List */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-48 bg-gray-200 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-red-600 font-semibold mt-12">{error}</p>
          ) : savedInterviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
              {savedInterviews.map((interview) => {
                const isClicked = clickedMockId === interview.mockId;
                return (
                  <div
                    key={interview.mockId}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/question/components/interview-questions/${interview.mockId}`
                      )
                    }
                  >
                    <div>
                      <h3
                        className="text-xl font-semibold text-indigo-700 mb-2 truncate"
                        title={interview.jobRole || interview.jobPosition}
                      >
                        {interview.jobRole || interview.jobPosition}
                      </h3>
                      <p
                        className="text-gray-700 mb-1 line-clamp-3"
                        title={interview.jobDescription || interview.jobDesc}
                      >
                        {interview.jobDescription || interview.jobDesc}
                      </p>
                      <p className="text-gray-500 text-sm mb-1">
                        <strong>Questions:</strong>{" "}
                        {interview.questionCount || interview.noOfQuestions}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      variant={isClicked ? "default" : "outline"}
                      className={`mt-4 flex items-center justify-center gap-2
                        ${isClicked ? "bg-indigo-600 text-white" : ""}
                        hover:bg-indigo-600 hover:text-white
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        setClickedMockId(interview.mockId);
                        router.push(
                          `/question/components/interview-questions/${interview.mockId}`
                        );
                      }}
                      disabled={isClicked}
                    >
                      <PlusCircle className="w-5 h-5" />
                      View Questions
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-12 text-lg">
              {search
                ? `No interviews found for "${search}".`
                : "No saved interviews available."}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
