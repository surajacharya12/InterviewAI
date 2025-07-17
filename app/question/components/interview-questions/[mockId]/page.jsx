"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle, ChevronLeft, ClipboardList } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function InterviewQA() {
  const { mockId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState(null);

  const fetchInterview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/InterviewApi/interview-questions");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to fetch interview");
        setInterview(null);
      } else {
        const found = data.data.find((item) => item.mockId === mockId);
        if (!found) {
          setError("Interview not found");
          setInterview(null);
        } else {
          setInterview(found);
        }
      }
    } catch (err) {
      setError(err.message || "Unexpected error");
      setInterview(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterview();
  }, [mockId]);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-12">
      {/* Back button */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-8"
        onClick={() => router.back()}
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Interviews
      </Button>

      {loading && (
        <p className="text-center my-12 text-gray-400 text-lg font-medium animate-pulse">
          Loading interview questions...
        </p>
      )}

      {error && (
        <p className="text-center my-12 text-red-600 font-semibold text-lg">
          {error}
        </p>
      )}

      {interview && (
        <>
          {/* Header */}
          <header className="mb-8 border-b pb-4">
            <h1 className="text-4xl font-extrabold text-indigo-900 flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-indigo-600" />
              {interview.jobRole || interview.jobPosition}
            </h1>
            <p className="mt-2 text-gray-600 max-w-xl">
              {interview.jobDescription || interview.jobDesc}
            </p>
          </header>

          {/* Accordion Questions */}
          {interview.questions && interview.questions.length > 0 ? (
            <Accordion type="single" collapsible>
              {interview.questions.map(({ question, answer }, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger>
                    Q{idx + 1}: {question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm bg-white p-4 rounded-md border border-gray-200">
                      {answer}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-gray-500 text-lg font-medium">
              No questions available for this interview.
            </p>
          )}
        </>
      )}
    </div>
  );
}
