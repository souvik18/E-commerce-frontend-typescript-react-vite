import { Menu, X, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type AuthFormData = {
  fullName?: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>();

  const onSubmit = (data: AuthFormData) => {
    console.log("Auth Data:", data);
    // 🔐 Replace with real auth logic
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    reset();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  /* 🔁 SINGLE NAV */
  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className={isMobile ? "space-y-2" : "flex space-x-8"}>
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setIsMenuOpen(false);
        }}
        className={`${
          isMobile ? "block w-full text-left px-4 py-2" : ""
        } text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 rounded`}
      >
        Home
      </button>

      {!isLoggedIn ? (
        <button
          onClick={() => {
            setAuthMode("signin");
            setIsAuthOpen(true);
            setIsMenuOpen(false);
          }}
          className={`${
            isMobile ? "block w-full text-left px-4 py-2" : ""
          } text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 rounded`}
        >
          Sign In / Sign Up
        </button>
      ) : (
        <button
          onClick={() => {
            handleLogout();
            setIsMenuOpen(false);
          }}
          className={`${
            isMobile ? "block w-full text-left px-4 py-2" : ""
          } text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded`}
        >
          Logout
        </button>
      )}
    </nav>
  );

  return (
    <>
      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                CapMania
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <NavLinks />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <NavLinks isMobile />
            </div>
          )}
        </div>
      </header>

      {/* AUTH MODAL */}
      {isAuthOpen && !isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-lg p-6 relative">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-center mb-4">
              {authMode === "signin" ? "Welcome Back" : "Create Account"}
            </h2>

            {/* Tabs */}
            <div className="flex justify-center mb-4 space-x-6">
              <button
                onClick={() => setAuthMode("signin")}
                className={`font-medium ${
                  authMode === "signin"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() => setAuthMode("signup")}
                className={`font-medium ${
                  authMode === "signup"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* FORM */}
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              {authMode === "signup" && (
                <input
                  {...register("fullName", { required: true })}
                  placeholder="Full Name"
                  className="w-full border rounded px-3 py-2"
                />
              )}

              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email",
                  },
                })}
                placeholder="Email Address"
                className="w-full border rounded px-3 py-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}

              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                placeholder="Password"
                className="w-full border rounded px-3 py-2"
              />

              {authMode === "signup" && (
                <>
                  <input
                    {...register("phone")}
                    placeholder="Phone Number"
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    {...register("address")}
                    placeholder="Address"
                    className="w-full border rounded px-3 py-2"
                  />
                </>
              )}

              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {authMode === "signin" ? "Sign In" : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
