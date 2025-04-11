import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-hot-toast";


const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTag, setFilteredTag] = useState("");

  // Fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const blogData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogData);
    };

    fetchBlogs();
  }, []);

  // Filter logic
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = filteredTag
      ? blog.tags?.includes(filteredTag.toLowerCase())
      : true;

    return matchesSearch && matchesTag;
  });

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Latest Blogs</h2>

      {/* 🔍 Search & Tag Filter UI */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search blogs..."
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredTag && (
          <button
            onClick={() => setFilteredTag("")}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Clear Tag Filter: #{filteredTag}
          </button>
        )}
      </div>

      {/* 📝 Blog Cards */}
      {filteredBlogs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">No blogs found.</p>
      ) : (
        filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-6"
          >
            <Link to={`/blog/${blog.id}`}>
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline">
                {blog.title}
              </h3>
            </Link>

            <p className="text-sm text-gray-500 dark:text-gray-300">
              By {blog.author?.email || "Unknown"}
            </p>

            <p className="mt-2 text-gray-700 dark:text-gray-200">
              {blog.content.slice(0, 120)}...
            </p>

            {/* 🏷️ Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {blog.tags?.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => setFilteredTag(tag.toLowerCase())}
                  className="text-xs bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white px-2 py-1 rounded hover:underline"
                >
                  #{tag}
                </button>
              ))}
            </div>

            <Link
              to={`/blog/${blog.id}`}
              className="inline-block mt-3 text-sm text-blue-500 hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))
      )}
    </div>
    </PageWrapper>
    
  );
};

export default Home;
