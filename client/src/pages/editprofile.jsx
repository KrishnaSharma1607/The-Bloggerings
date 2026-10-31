import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./editprofile.css";
const EditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    email: "",
    avatar: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 protect page
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("http://localhost:8081/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data) setForm(data);
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8081/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    navigate("/dashboard");
  };

  return (
    <div className="edit-profile-page">
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
        />

        <input
          name="avatar"
          placeholder="Avatar URL"
          value={form.avatar}
          onChange={handleChange}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
