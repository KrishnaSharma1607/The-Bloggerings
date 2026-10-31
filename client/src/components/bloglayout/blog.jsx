// home and dashboard pe pas control hoga konsa blog fetch krna h this will just display the data
import React, { useState, useEffect } from "react";
import "./blog.css";
import CreateBlog from "../createBlog/createBlog";
import ProfileSidebar from "../profile/prolife";
import { Link } from "react-router-dom";
import AIAssistant from "../aiAssist/aiAssist";
const Bloglayout = ({ blogs,setBlogs,showSidebar = false, showCreate = false, openAI }) => {
  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // start editing a blog
  const startEdit = (blog) => {
    setEditingId(blog._id);
    setEditTitle(blog.title);
    setEditSubject(blog.subject);
    setEditContent(blog.content);
    setEditCategory(blog.category);
  };

  // save edited blog
  const saveEdit = async (id) => {
    try {
      //yaha bheja jo hi updated data tha jab usne save pe click kiya 
      const res = await fetch(`http://localhost:8081/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          subject: editSubject,
          content: editContent,
          category: editCategory,
        }),
      });
      // bheja to vo DB m save ho gya and ab vo data retireve kiya 
      const updatedBlog = await res.json();
      // retrieve kiya uske baad updated blog display hua 
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === id ? updatedBlog : blog
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  // delete blog
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:8081/blogs/${id}`, {
        method: "DELETE",
      });

      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="blog-container">

      {/* BLOG COLUMN */}
      <div className="blog-column">

        {/* Create blog only for dashboard */}
        {showCreate && (
          <CreateBlog
            onBlogCreated={(newBlog) =>
            setBlogs((prev) => [newBlog, ...prev])
          }
          openAI={openAI}
          />

        )}

        {blogs.map((blog) => (
          <div className="blog-post" key={blog._id}>
            {/* editingId === blog._id → Edit mode
            Otherwise → Read mode */}
            {editingId === blog._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                />
                <textarea
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  placeholder="Subject"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Content"
                />

                <input
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="Category"
                />

                <button onClick={() => saveEdit(blog._id)}>
                  Save
                </button>

                <button onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <Link to={`/blogs/${blog._id}`} className="blog-link">
                  <h2>{blog.title}</h2>
                  <p className="blog-subject">{blog.subject}</p>
                </Link>

  <p><strong>Category:</strong> {blog.category}</p>

                
                {/* Edit + Delete only on dashboard */}
                {showCreate && (
                  <>
                    <button onClick={() => startEdit(blog)}>
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(blog._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}

          </div>
        ))}
      </div>

      {showSidebar && (
      <div className="sidebar">
        <div className="sidebar-box">
          <ProfileSidebar />
        </div>
        <div className="sidebar-box ai-sticky">
          <AIAssistant />
        </div>
      </div>
    )}
    </div>
  );
};

export default Bloglayout;
