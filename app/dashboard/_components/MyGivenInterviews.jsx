"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "sonner";

export default function MyGivenInterviews() {

  return (
    <>
    <Toaster position="top-center" richColors />
    <div className="mt-12 max-w-6xl mx-auto px-4">
      <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Your Given Interviews
      </h3>
    </div>
    </>    
  );
}
