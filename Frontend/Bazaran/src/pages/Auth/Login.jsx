import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import loginImage from "../../assets/img4.jpg";
import Logo from "../../assets/logo1.png";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;


const Login = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selectedRole, setSelectedRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleRoleSelect = (role) => setSelectedRole(role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: selectedRole, // send the selected role to backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Check if the user's actual role matches selected role
      if (data.role !== selectedRole) {
        throw new Error(
          `Selected role does not match user's role.`,
        );
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      updateUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
      });

      // Redirect based on role
      if (data.role === "admin") navigate("/admin-dashboard");
      else if (data.role === "vendor") navigate("/vendor-dashboard");
      else navigate("/home"); // default user home
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      // 1️⃣ Get Google user info
      const googleUser = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );

      // 2️⃣ Send to backend
      const res = await axios.post(
        `${API_BASE}/api/users/google`,
        {
          name: googleUser.data.name,
          email: googleUser.data.email,
          googleId: googleUser.data.sub,
        }
      );

      // ❗ THIS is the important fix
      localStorage.setItem("token", res.data.token);
      console.log("Saved token:", res.data.token);

      navigate("/home");

    } catch (error) {
      console.error(
        "Google login failed",
        error.response?.data || error
      );
    }
  },

  onError: () => {
    console.log("Google Login Failed");
  },
});


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src={Logo} alt="Logo" className="scale-75" />
            </div>
            <h2 className="text-2xl text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-1">Glad to have you back</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-5">
            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-3">
              <p className="text-gray-700 font-medium text-sm">Login as:</p>
              <div className="grid grid-cols-3 gap-3">
                {/* User Role */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect("user")}
                  className={`py-2 px-3 rounded-lg border-2 font-medium transition-all flex flex-col items-center gap-2 ${
                    selectedRole === "user"
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span className="text-xs">User</span>
                </button>

                {/* Admin Role */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect("admin")}
                  className={`py-2 px-3 rounded-lg border-2 font-medium transition-all flex flex-col items-center gap-2 ${
                    selectedRole === "admin"
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                  <span className="text-xs">Admin</span>
                </button>

                {/* Vendor Role */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect("vendor")}
                  className={`py-2 px-3 rounded-lg border-2 font-medium transition-all flex flex-col items-center gap-2 ${
                    selectedRole === "vendor"
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                  <span className="text-xs">Vendor</span>
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-full transition-colors mt-6"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-600 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#4A90E2"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#FBBC05"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Log in using Google
          </button>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Image */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    </div>
  );
};

export default Login;
