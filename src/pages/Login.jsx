import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { sendPasswordResetEmail } from "firebase/auth";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

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
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }
  
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error("Error sending reset email: " + error.message);
    }
  };
  

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(); // from context
      toast.success("Logged in with Google!");
      navigate("/profile");
    } catch (err) {
      toast.error("Google login failed");
      console.error("Google Login Error:", err); // Add this to see real error
    }
  };

  return (
    <PageWrapper>
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-80"
        >
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
            Login
          </h2>

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
            className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p
  onClick={handleForgotPassword}
  className="text-sm text-blue-500 hover:underline cursor-pointer text-right mb-4"
>
  Forgot Password?
</p>


          <button
            type="submit"
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
        </form>
      </div>
    </PageWrapper>
  );
};

export default Login;
