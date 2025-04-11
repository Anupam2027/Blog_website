import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-hot-toast";


const BlogDetails = () => {
  const { id } = useParams(); // blog ID from URL
  const { user } = useAuth();  // logged-in user
  const [blog, setBlog] = useState(null); // blog data
  const [comment, setComment] = useState(""); // new comment
  const [comments, setComments] = useState([]); // list of comments

  // Get blog by ID from Firestore
  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const blogData = docSnap.data();
        setBlog(blogData);
        setComments(blogData.comments || []);
      }
    };

    fetchBlog();
  }, [id]);

  // Like/unlike blog
  const handleLike = async () => {
    if (!user) return toast.error("Please log in to like this blog");

    const blogRef = doc(db, "blogs", id);
    const isLiked = blog?.likes?.includes(user.uid);

    await updateDoc(blogRef, {
      likes: isLiked
        ? arrayRemove(user.uid)
        : arrayUnion(user.uid),
    });

    // Update UI
    setBlog((prev) => ({
      ...prev,
      likes: isLiked
        ? prev.likes.filter((uid) => uid !== user.uid)
        : [...(prev.likes || []), user.uid],
    }));
  };

  // Submit a comment
  const handleComment = async () => {
    if (!comment.trim()) return
    toast.success("Comment added!");
    const newComment = {
      text: comment,
      user: user.email,
      createdAt: new Date().toISOString(),
      
    };

    const blogRef = doc(db, "blogs", id);
    await updateDoc(blogRef, {
      comments: arrayUnion(newComment),
    });

    setComments([...comments, newComment]);
    setComment("");
  };

  if (!blog) return <div className="text-center mt-20">Loading blog...</div>;

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">{blog.title}</h1>

      <p className="text-sm text-gray-500 mb-4">
        by {blog.author.email} •{" "}
        {blog.createdAt?.seconds &&
          format(new Date(blog.createdAt.seconds * 1000), "PPpp")}
      </p>

      <div className="text-lg leading-relaxed whitespace-pre-line text-gray-700 dark:text-gray-200 mb-4">
        {blog.content}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags?.map((tag, index) => (
          <span
            key={index}
            className="text-xs bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white px-2 py-1 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Like Button */}
      {user && (
        <button
          onClick={handleLike}
          className="bg-pink-100 dark:bg-pink-800 text-pink-700 dark:text-white px-4 py-1 rounded text-sm"
        >
          {blog.likes?.includes(user.uid) ? "Unlike" : "Like"} ({blog.likes?.length || 0})
        </button>
      )}

      {/* Comment Input */}
      {user && (
        <div className="mt-6">
          <textarea
            className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleComment}
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            Submit Comment
          </button>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Comments:</h3>
        {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}
        {comments.map((c, index) => (
          <div
            key={index}
            className="mb-2 p-3 bg-gray-100 dark:bg-gray-700 rounded"
          >
            <p className="font-semibold text-sm">{c.user}</p>
            <p className="text-sm text-gray-700 dark:text-white">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
    </PageWrapper>
    
  );
};

export default BlogDetails;
