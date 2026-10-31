import { useEffect, useState } from "react";
import Bloglayout from "../components/bloglayout/blog";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/blogs")
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Bloglayout
      blogs={blogs}
      setBlogs={setBlogs}
      showSidebar={false}
      showCreate={false}
    />
  );
};

export default Home;
