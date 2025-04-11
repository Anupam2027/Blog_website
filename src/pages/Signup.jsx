import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created!");
      navigate("/profile");
    } catch (err) {
      toast.error("Signup Failed: " + err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      toast.success("Signed up with Google!");
      navigate("/profile");
    } catch (err) {
      toast.error("Google sign-up failed");
    }
  };

  return (
    <PageWrapper>
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <form
          onSubmit={handleSignup}
          className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-80"
        >
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
            Sign Up
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

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Create Account
          </button>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full bg-red-500 text-white py-2 mt-3 rounded hover:bg-red-600"
          >
            Sign up with Google
          </button>

          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </PageWrapper>
  );
};

export default Signup;
