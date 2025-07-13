import { SignUp } from '@clerk/nextjs'
import { FaUserPlus } from 'react-icons/fa' // example icon

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col items-center space-y-4 mb-6">
        <FaUserPlus className="text-5xl text-green-600" />
        <h1 className="text-2xl font-bold">Create your account</h1>
      </div>

      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-white',
            card: 'shadow-lg p-4 border border-gray-200 rounded-xl',
          },
          variables: {
            colorPrimary: '#16a34a',
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  )
}
