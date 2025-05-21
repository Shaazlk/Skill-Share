import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Setup Axios interceptor to properly handle authentication
  useEffect(() => {
    // Create a request interceptor for ALL requests
    const interceptor = axios.interceptors.request.use(
      (config) => {
        // Check for token in localStorage each time (in case it was updated elsewhere)
        const currentToken = localStorage.getItem("token");

        // Add token to request headers if it exists
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
          console.log(`🔐 Request with auth: ${config.url.split("?")[0]}`);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Setup response interceptor to handle auth errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401/403 errors
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          console.log(
            `🚫 Auth error for ${error.config.url}: ${error.response.status}`
          );
          // Only logout if token exists but is invalid/expired
          if (localStorage.getItem("token")) {
            console.log("Token exists but is invalid - logging out");
            // Don't call logout directly to avoid circular references
            localStorage.removeItem("token");
            setToken(null);
            setCurrentUser(null);
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors on unmount
    return () => {
      axios.interceptors.request.eject(interceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (token && !authInitialized) {
      fetchCurrentUser();
    } else {
      setLoading(false);
      setAuthInitialized(true);
    }
  }, [token]);

  // Fetch the current user's details using the token
  const fetchCurrentUser = async () => {
    try {
      console.log("Fetching current user data");
      const response = await axios.get("http://localhost:8080/users/me");
      setCurrentUser(response.data.user);
      setAuthInitialized(true);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Clear invalid token
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken);

      // Fetch user data after successful login
      await fetchCurrentUser();

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      return {
        success: false,
        message:
          error.response?.data?.error ||
          "Login failed. Please check your credentials.",
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        userData
      );

      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken);

      // Fetch user data after successful registration
      await fetchCurrentUser();

      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      setLoading(false);
      return {
        success: false,
        message:
          error.response?.data?.error ||
          "Registration failed. Please try again.",
      };
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!token,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
