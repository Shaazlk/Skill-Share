import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { Moon, Sun } from "lucide-react";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Check for user's preferred color scheme or saved preference on component mount
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    } else if (savedTheme === "light") {
      setDarkMode(false);
    } else {
      // If no saved preference, check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class to document when darkMode state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      const result = await loginWithGoogle();
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || "Failed to login with Google");
      }
    } catch (err) {
      setError("An unexpected error occurred during Google login. Please try again.");
      console.error("Google login error:", err);
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen px-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`w-full max-w-md rounded-lg shadow-lg p-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Login</h2>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-700"}`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {error && (
          <div className={`p-4 rounded-md mb-6 border ${darkMode ? "bg-red-900 text-red-200 border-red-700" : "bg-red-50 text-red-600 border-red-200"}`}>
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          type="button"
          className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition-colors duration-300 mb-6 font-medium border 
          ${darkMode 
            ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" 
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </button>

        <div className={`flex items-center my-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <div className="px-3 text-sm">OR</div>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500" 
                      : "bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={`mt-1 text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500" 
                      : "bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={`mt-1 text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Don't have an account?{" "}
            <Link
              to="/register"
              className={`font-medium ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"}`}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;