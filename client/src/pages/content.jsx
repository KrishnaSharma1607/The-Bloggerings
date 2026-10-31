import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./content.css";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:8081/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
      } catch (error) {
        console.error("Failed to load blog", error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="blog-details-container">

      <h1>{blog.title}</h1>
      <p className="blog-subject">{blog.subject}</p>

      <div className="blog-meta">
        <span>By {blog.author?.email || "Unknown author"}</span>
        <span>
          {new Date(blog.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="blog-content">
        {blog.content}
      </div>
    </div>
  );
};

export default BlogDetails;
