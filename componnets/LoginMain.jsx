"use client";
import { FaFacebook } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Loading from "../loading";

function LoginMain() {
  const { status, data } = useSession();
  const router = useRouter();

  function login(provider) {
    if (provider === "google" || provider === "facebook") {
      signIn(provider, { callbackUrl: "/inventory" });
    } else {
      toast.error(
        "This login feature is not available yet. Please try again later."
      );
    }
  }

  if (status === "authenticated") {
    router.push("/auth");
  }

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-5"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-5"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Main card */}
        <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white border-opacity-10">
          {/* Logo and header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-6 shadow-lg"
            >
              <div className="w-8 h-8 bg-black rounded-lg"></div>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to StockFlow
            </h1>
            
            <p className="text-gray-400 text-sm">
              Choose your preferred way to sign in
            </p>
          </div>

          {/* Login buttons */}
          <div className="space-y-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => login("google")}
              className="w-full flex items-center justify-center px-6 py-4 bg-white hover:bg-gray-100 text-black rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <img
                className="w-5 h-5 mr-3"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
              />
              Continue with Google
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => login("facebook")}
              className="w-full flex items-center justify-center px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-700 group"
            >
              <FaFacebook className="w-5 h-5 mr-3" />
              Continue with Facebook
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => login("twitter")}
              className="w-full flex items-center justify-center px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-600 group"
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
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
          
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

         
          
        </div>

        {/* Bottom text */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
           
          </p>
        </div>
      </motion.div>

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
