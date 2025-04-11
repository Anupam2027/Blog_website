import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-hot-toast";


const Login = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // for redirect after login

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Firebase login with email/password
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error("Login Failed: " + err.message);
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
    </PageWrapper>
    
  );
};

export default Login;
