import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);

  // Fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      const snap = await getDocs(collection(db, "blogs"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogs(data);
    };
    fetchBlogs();
  }, []);

  // 🔥 Delete with toast confirmation
  const handleDelete = async (id) => {
    toast((t) => (
      <div className="text-sm">
        <p>Delete this blog?</p>
        <div className="flex gap-3 mt-3">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={async () => {
              await deleteDoc(doc(db, "blogs", id));
              setBlogs(blogs.filter((blog) => blog.id !== id));
              toast.dismiss(t.id);
              toast.success("Blog deleted successfully!");
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Admin Blog Dashboard
        </h2>

        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-300">
              {blog.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              By {blog.author?.email}
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {blog.content.slice(0, 100)}...
            </p>
            <button
              onClick={() => handleDelete(blog.id)}
              className="mt-3 bg-red-500 text-white px-4 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
