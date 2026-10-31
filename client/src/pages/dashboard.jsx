import { useEffect, useState } from "react";
import Bloglayout from "../components/bloglayout/blog";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import AIAssistant from "../components/aiAssist/aiAssist";
const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-blur">
          <Bloglayout
            blogs={blogs}
            setBlogs={setBlogs}
            showSidebar={true}
            showCreate={true}
          />
        </div>
        <div className="dashboard-overlay">
          <h2>Login required</h2>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Signup</button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetch("http://localhost:8081/dashboard/blogs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <Bloglayout
      blogs={blogs}
      setBlogs={setBlogs}
      showSidebar={true}
      showCreate={true}
    />
  );
};

export default Dashboard;
