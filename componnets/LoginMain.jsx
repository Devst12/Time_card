"use client";
import { FaFacebook } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loading from "@/app/loading";
import { Clock, TrendingUp } from "lucide-react";

function LoginMain() {
  const { status } = useSession();
  const router = useRouter();

  function login(provider) {
    if (provider === "google" || provider === "facebook") {
      signIn(provider, { callbackUrl: "/" });
    } else {
      toast.error(
        "This login feature is not available yet. Please try again later."
      );
    }
  }

  if (status === "authenticated") {
    router.push("/");
  }

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white grid grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:flex flex-col items-center justify-center p-12 bg-black overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-left w-full max-w-md"
        >
          <div className="inline-flex items-center gap-3 mb-4 p-2 pr-4 bg-gray-800/50 border border-gray-700 rounded-full">
            <div className="p-2 bg-white rounded-full">
              <Clock className="w-5 h-5 text-black" />
            </div>
            <span className="font-semibold text-gray-300">Time Card System</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Track Your Time, <br /> Master Your Workflow.
          </h1>
          <p className="text-gray-400 mb-8 max-w-prose">
            Welcome to your new time management hub. Log in to access your dashboard, track hours, and boost productivity.
          </p>
          <div className="w-full h-64 bg-gray-800/50 rounded-2xl border border-gray-700 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="mx-auto w-12 h-12 mb-2" />
              <p>Your Image/GIF placeholder</p>
            </div>
          </div>
        </motion.div>
        
        <div className="absolute w-[500px] h-[500px] bg-white/5 rounded-full -bottom-48 -left-48 blur-3xl opacity-50"></div>
        <div className="absolute w-[300px] h-[300px] bg-white/5 rounded-full top-10 right-10 blur-3xl opacity-40"></div>
      </div>

      <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-sm"
        >
          <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white border-opacity-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Time Card Login
              </h1>
              <p className="text-gray-400 text-sm">
                Log in to track your time efficiently
              </p>
            </div>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => login("google")}
                className="w-full flex items-center justify-center px-6 py-3.5 bg-white hover:bg-gray-200 text-black rounded-xl font-semibold transition-all duration-200 shadow-lg group"
              >
                <img
                  className="w-5 h-5 mr-3"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                />
                Continue with Google
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => login("facebook")}
                className="w-full flex items-center justify-center px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg border border-gray-700 group"
              >
                <FaFacebook className="w-5 h-5 mr-3" />
                Continue with Facebook
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => login("twitter")}
                className="w-full flex items-center justify-center px-6 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg border border-gray-600 group"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Continue with X
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}

export default LoginMain;