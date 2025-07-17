"use client";

import React, { useState } from "react";
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
import { Rocket, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const jobRole = form.jobRole.value.trim();
    const jobDescription = form.jobDescription.value.trim();
    const experience = form.experience.value.trim();
    const questionCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5;

    try {
      const response = await fetch("/api/InterviewApi/generate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobRole, jobDescription, experience, questionCount }),
      });

      const data = await response.json();
      console.log("API Response Data:", data);

      if (response.status === 429) {
        alert(data.error || "Too many requests. Please wait.");
        console.error("Rate Limit Error:", data.error);
      } else if (!data.success) {
        alert(data.error || "Failed to generate interview.");
        console.error("API Error:", data.error);
      } else {
        console.log("✅ Generated Interview:", data.result);
        if (data.mockId) {
          router.push(`/dashboard/`);
        } else {
          console.warn("❗ mockId not found in response.");
          alert("Interview generated but no mock ID returned.");
        }
      }
    } catch (err) {
      alert("Network error, please try again.");
      console.error("❌ Network Error:", err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          onClick={() => setOpen(true)}
          className="p-10 border rounded-lg bg-gradient-to-br from-blue-100 to-indigo-200 hover:scale-105 hover:shadow-xl cursor-pointer transition duration-300"
        >
          <h2 className="font-bold text-lg text-center text-indigo-800">+ Add New Interview</h2>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Tell us more about your interview</DialogTitle>
          <DialogDescription>
            Add details about your job position, job description, and years of experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Role / Position</label>
            <Input
              name="jobRole"
              type="text"
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Job Description</label>
            <Textarea
              name="jobDescription"
              placeholder="e.g. Build scalable web apps using React and Node.js"
              rows={4}
              className="resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Years of Experience</label>
            <Input
              name="experience"
              type="number"
              placeholder="e.g. 2"
              min="0"
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={loading}>
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Rocket className="w-4 h-4 mr-2" />
              {loading ? "Generating..." : "Start Interview"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewInterview;
