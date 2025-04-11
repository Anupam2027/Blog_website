import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-hot-toast";


const Signup = () => {
  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Redirect after signup

  // Function when form is submitted
  const handleSignup = async (e) => {
    e.preventDefault(); // prevent reload

    try {
      // Create user with Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email,
        bio: "",        // Empty by default
        photoURL: ""    // Empty by default
      });

      // Navigate to dashboard or profile
      toast.success("Account created!");
      navigate("/profile");
    } catch (err) {
      toast.error("Signup Failed: " + err.message);
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
      </form>
    </div>
    </PageWrapper>
    
  );
};

export default Signup;
