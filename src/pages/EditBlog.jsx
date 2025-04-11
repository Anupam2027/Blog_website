import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-hot-toast";


const EditBlog = () => {
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();

  // State to hold blog values
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  // Fetch blog by ID on page load
  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const blog = docSnap.data();
        setTitle(blog.title);
        setContent(blog.content);
        setTags(blog.tags ? blog.tags.join(", ") : "");
      } else {
        toast.error("Blog not found");
        navigate("/");
      }
    };

    fetchBlog();
  }, [id, navigate]);

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      await updateDoc(doc(db, "blogs", id), {
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim().toLowerCase()),
      });
  
      toast.success("Blog updated successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error("Failed to update blog.");
    }
  };
  

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Edit Blog</h2>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Blog content"
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
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Update Blog
        </button>
      </form>
    </div>
    </PageWrapper>
    
  );
};

export default EditBlog;
