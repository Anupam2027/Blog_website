import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();
  const [myBlogs, setMyBlogs] = useState([]);
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  // Fetch user profile + their blogs
  useEffect(() => {
    const fetchData = async () => {
      // Get user doc
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setBio(data.bio || "");
        setPhotoURL(data.photoURL || "");
      }

      // Get user's blogs
      const q = query(collection(db, "blogs"), where("author.uid", "==", user.uid));
      const snap = await getDocs(q);
      const blogs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMyBlogs(blogs);
    };

    fetchData();
  }, [user.uid]);

  // Save bio and photo
  const handleSave = async () => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { bio, photoURL });
toast.success("Profile updated!");
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (confirm) {
      await deleteDoc(doc(db, "blogs", id));
      toast.success("Blog deleted!");
      setMyBlogs(myBlogs.filter((blog) => blog.id !== id));
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Profile</h2>

      {/* Profile Info */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <img
          src={photoURL || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />

        <p className="text-gray-700 dark:text-gray-200 mb-2"><strong>Email:</strong> {user.email}</p>

        <input
          type="text"
          placeholder="Profile Photo URL"
          className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:text-white"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
        />

        <textarea
          placeholder="Your bio..."
          className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:text-white"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Profile
        </button>
      </div>

      {/* User Blogs */}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Blogs</h3>

      {myBlogs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">You haven't posted any blogs yet.</p>
      ) : (
        myBlogs.map((blog) => (
          <div key={blog.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
            <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400">{blog.title}</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {blog.content.slice(0, 100)}...
            </p>

            <div className="flex gap-3">
              <Link to={`/edit/${blog.id}`}>
                <button className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              </Link>
              <button
                onClick={() => handleDelete(blog.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
    </PageWrapper>
    
  );
};

export default Profile;
