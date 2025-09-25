"use client"
import { useRouter } from "next/navigation"
import { FaExclamationTriangle, FaEnvelope, FaFacebook, FaWhatsapp } from "react-icons/fa"

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-red-600 mb-2">Something went wrong</h1>
      <p className="text-gray-700 mb-6">Please try again or contact us for help.</p>

      <button
        onClick={() => router.refresh()}
        className="px-8 py-2 border-2 border-black text-black rounded-lg transition-all duration-300 hover:bg-red-500 hover:text-black hover:border-white"
      >
        Reload
      </button>

      <div className="flex items-center justify-center gap-6 mt-8">
        <a
          href="mailto:support@example.com"
          className="text-gray-500 text-3xl hover:text-red-500 transition"
        >
          <FaEnvelope />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 text-3xl hover:text-blue-600 transition"
        >
          <FaFacebook />
        </a>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 text-3xl hover:text-green-500 transition"
        >
          <FaWhatsapp />
        </a>
      </div>
    </div>
  )
}
