"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const NavBar = () => {
  const { status, data } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Help", href: "/Help" },
    { label: "Contact Us", href: "/contact" },
  ];

  const toggleMobileMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Handle outside clicks to close the mobile menu
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800 fixed top-0 w-full z-50 backdrop-blur-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="text-2xl font-bold text-white tracking-tight hover:scale-105 transition-all duration-300 hover:text-gray-300"
      >
        <span className="text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Stock
        </span>
        <span className="text-gray-400">Flow</span>
      </Link>

      <button
        ref={toggleButtonRef}
        className="md:hidden text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg p-2 transition-all duration-200"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <svg
          className="w-6 h-6 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: isMobileMenuOpen ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      <div className="hidden md:flex items-center gap-8 mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative text-base font-medium transition-all duration-300 group ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              } focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-md px-3 py-2`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transform transition-all duration-300 ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          );
        })}
      </div>

      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`${
          isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } md:hidden fixed top-[73px] left-0 w-full bg-black border-b border-gray-800 backdrop-blur-lg p-6 flex flex-col gap-4 transition-all duration-300 ease-in-out max-h-[calc(100vh-73px)] overflow-auto`}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative text-base font-medium py-3 px-4 rounded-lg transition-all duration-300 group ${
                isActive
                  ? "text-white bg-gray-900 border-l-4 border-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}

        <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-gray-800">
          {status === "authenticated" ? (
            <>
              <Link
                href="/"
                className={`text-center py-3 px-4 border-2 rounded-lg text-base font-medium transition-all duration-300 ${
                  pathname === "/"
                    ? "bg-white text-black border-white"
                    : "text-white border-white hover:bg-white hover:text-black"
                } focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {data?.user?.name || "Store"}
                </div>
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="text-center py-3 px-4 bg-gray-900 text-white rounded-lg text-base font-medium hover:bg-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className={`text-center py-3 px-4 border-2 rounded-lg text-base font-medium transition-all duration-300 ${
                pathname === "/auth"
                  ? "bg-white text-black border-white"
                  : "text-white border-white hover:bg-white hover:text-black"
              } focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
                status === "loading" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {status === "loading" ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                "Login"
              )}
            </Link>
          )}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        {status === "authenticated" ? (
          <>
            <Link
              href="/"
              className={`py-2 px-6 border-2 rounded-lg text-base font-medium transition-all duration-300 ${
                pathname === "/inventory"
                  ? "bg-white text-black border-white shadow-lg"
                  : "text-white border-white hover:bg-white hover:text-black hover:shadow-lg"
              } focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                {data?.user?.name || "Store"}
              </div>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="py-2 px-6 bg-gray-900 text-white rounded-lg text-base font-medium hover:bg-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/auth"
            className={`py-2 px-6 border-2 rounded-lg text-base font-medium transition-all duration-300 ${
              pathname === "/auth"
                ? "bg-white text-black border-white shadow-lg"
                : "text-white border-white hover:bg-white hover:text-black hover:shadow-lg"
            } focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              status === "loading" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {status === "loading" ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              "Login"
            )}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;