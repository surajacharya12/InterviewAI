import { SignIn } from '@clerk/nextjs'
import { FaUserLock } from 'react-icons/fa' // example icon
import Image from 'next/image'

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col items-center space-y-4 mb-6">
        <FaUserLock className="text-5xl text-blue-600" />
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
      </div>

      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
            card: 'shadow-lg p-4 border border-gray-200 rounded-xl',
          },
          variables: {
            colorPrimary: '#2563eb',
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  )
}
