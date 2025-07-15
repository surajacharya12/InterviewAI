import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import Image from "next/image";
import MyCreatedInterviews from "./_components/MyCreatedInterviews";
import MyGivenInterviews from "./_components/MyGivenInterviews";

export default function DashboardPage() {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Create and start your AI-powered mock interview
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mt-10">
        <section className="w-full bg-gradient-to-tr from-indigo-50 to-blue-100 rounded-2xl 
        shadow-md p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center ml-8 md:ml-20">
          {/* Left Content */}
          <div className="space-y-5 pr-6">
            <h2 className="text-4xl font-bold leading-snug text-indigo-900">
              Get Interview-Ready with AI-Powered Practice & Feedback
            </h2>
            <p className="text-base text-gray-700">
              Our AI-powered tool helps you prepare for interviews with
              confidence. Get personalized feedback and practice questions to
              sharpen your skills and ace interviews.
            </p>
            <AddNewInterview />
          </div>

          {/* Right Image */}
          <div className="hidden sm:block text-center pl-12">
            <Image
              src="/robot.png"
              alt="Robot"
              width={400}
              height={400}
              className="object-contain mx-auto"
            />
          </div>
        </section>
      </div>
        {/* Your Interviews Section */}
        <MyGivenInterviews />
        <MyCreatedInterviews />
    </div>
  );
}
