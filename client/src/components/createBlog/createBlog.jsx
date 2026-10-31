 import React, { useState } from "react";

const CreateBlog = ({ onBlogCreated, openAI }) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !subject) {
      alert("Title, subject & content are required");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to create a blog");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8081/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          subject,
          content,
          category,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create blog");
      }

      const data = await res.json();

      setTitle("");
      setSubject("");
      setContent("");
      setCategory("");

      onBlogCreated(data);
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Something went wrong while creating the blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-blog-form">
      <h2>Create New Blog</h2>
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        rows={3}
      />

      <textarea
        placeholder="Blog Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
      />

      <input
        type="text"
        placeholder="Category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Create Blog"}
      </button>
    </form>
  );
};

export default CreateBlog;
