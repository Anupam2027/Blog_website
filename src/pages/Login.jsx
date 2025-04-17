import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, loginWithGoogle, logout } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error("Login Failed: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google!");
      navigate("/profile");
    } catch (err) {
      toast.error("Google login failed");
      console.error("Google Login Error:", err);
    }
  };

  return (
    <PageWrapper>
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <form className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-80">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
            Login
          </h2>

          {user ? (
            <div className="text-center text-gray-700 dark:text-white space-y-4">
              <p className="text-md">You’re already signed in as</p>
              <p className="font-semibold">{user.email}</p>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <p
                onClick={async () => {
                  if (!email) return toast.error("Please enter your email first.");
                  try {
                    await sendPasswordResetEmail(auth, email);
                    toast.success("Password reset email sent!");
                  } catch (error) {
                    toast.error("Error sending reset email: " + error.message);
                  }
                }}
                className="text-sm text-blue-500 hover:underline cursor-pointer text-right mb-3"
              >
                Forgot Password?
              </p>

              <button
                type="submit"
                onClick={handleLogin}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Login
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-red-500 text-white py-2 mt-3 rounded hover:bg-red-600"
              >
                Continue with Google
              </button>

              <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
                New here?{' '}
                <Link to="/signup" className="text-blue-500 hover:underline">
                  Create an account
                </Link>
              </p>
            </>
          )}
        </form>
      </div>
    </PageWrapper>
  );
};

export default Login;
