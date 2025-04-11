import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-hot-toast";

const Write = () => {
  // Fields state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const { user } = useAuth(); // current user
  const navigate = useNavigate(); // for redirect

  // Handle blog submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
    return toast.error("Title and Content are required!");
    }

    try {
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim().toLowerCase()),
        createdAt: serverTimestamp(),
        author: {
          uid: user.uid,
          email: user.email,
        },
      });

      toast.success("Blog posted successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Write a Blog</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your blog content..."
          rows="10"
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Publish Blog
        </button>
      </form>
    </div>
    </PageWrapper>
    
  );
};

export default Write;
