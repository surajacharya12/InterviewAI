"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Webcam from "react-webcam"
import {
  WebcamIcon,
  BriefcaseIcon,
  FileCodeIcon,
  BadgeCheckIcon,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
function DetailItem({ Icon, title, text }) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="text-indigo-600 w-6 h-6 mt-1 flex-shrink-0" />
      <div>
        <p className="text-xs uppercase font-semibold text-indigo-400 mb-1 tracking-wide">{title}</p>
        <p className="text-lg font-medium text-gray-900">{text}</p>
      </div>
    </div>
  )
}

export default function InterviewPage() {
  const { interviewId } = useParams()
  const [webCamEnable, setWebCamEnable] = useState(false)
  const [interviewData, setInterviewData] = useState(null)
  const [startClicked, setStartClicked] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (!interviewId) return

    const fetchInterview = async () => {
      try {
        const res = await fetch(`/api/interview/${interviewId}`)
        if (!res.ok) throw new Error("Interview not found")
        const data = await res.json()
        setInterviewData(data)
      } catch (err) {
        console.error("Error fetching interview:", err)
      }
    }

    fetchInterview()
  }, [interviewId])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-12 tracking-tight drop-shadow-sm">
        Let’s Get Started!
      </h1>

      {/* Container: flex-col on mobile, flex-row on md+ */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-16">

        {/* Left Section: Interview Details */}
        <section className="md:w-1/2 space-y-8">
          {/* Details Box */}
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
            {interviewData ? (
              <>
                <DetailItem Icon={BriefcaseIcon} title="Job Role / Position" text={interviewData.jobPosition} />
                <DetailItem Icon={FileCodeIcon} title="Job Description / Stack" text={interviewData.jobDesc} />
                <DetailItem Icon={BadgeCheckIcon} title="Required Experience" text={interviewData.jobExperience} />
              </>
            ) : (
              <p className="text-gray-400 text-center py-12 animate-pulse">
                Loading interview data...
              </p>
            )}
          </div>

          {/* Information Box */}
          <div className="p-6 bg-yellow-50 border border-yellow-300 rounded-xl shadow-sm">
            <h2 className="flex items-center gap-2 text-yellow-700 font-semibold text-lg mb-2">
              <Lightbulb className="w-6 h-6" /> Information
            </h2>
            <p className="text-yellow-900 text-sm leading-relaxed">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </p>
          </div>
        </section>

        {/* Right Section: Webcam */}
        <section className="md:w-1/2 flex flex-col justify-between h-[420px] md:h-auto">
          {/* Webcam Area */}
          <div className="flex flex-col items-center gap-8 justify-center flex-grow">
            {webCamEnable ? (
              <Webcam
                onUserMedia={() => setWebCamEnable(true)}
                onUserMediaError={() => setWebCamEnable(false)}
                mirrored
                className="rounded-3xl border border-indigo-300 shadow-2xl max-w-full max-h-[320px]"
                style={{ aspectRatio: "1 / 1" }}
              />
            ) : (
              <>
                <div className="flex items-center justify-center bg-indigo-50 border border-indigo-300 shadow rounded-3xl w-[320px] h-[320px]">
                  <WebcamIcon className="text-indigo-600 w-20 h-20" />
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-[320px] hover:bg-indigo-600 hover:text-white transition"
                  onClick={() => setWebCamEnable(true)}
                >
                  Enable Web Cam and Microphone
                </Button>
              </>
            )}
          </div>

          {/* Start Interview Button */}
          <div className="flex justify-end mt-6">
            <Button
              size="lg"
              className={`shadow-lg text-white ${startClicked ? "bg-blue-600" : "bg-indigo-700 hover:bg-indigo-800"}`}
              disabled={!interviewData}
              onClick={() => {
                setStartClicked(true);
                router.push(`/dashboard/interView/${interviewId}/start`);
              }}
            >
              Start Interview
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
