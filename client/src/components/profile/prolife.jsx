import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const ProfileSidebar = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8081/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProfile(data);
    };
  fetchProfile();
}, []);


  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <>
      <h3>Profile</h3>
      <img
        src={profile.avatar || "https://via.placeholder.com/300x200"}
        alt="Profile"
      />
      <p><strong>{profile.name}</strong></p>
      <p>{profile.bio}</p>
      <p>{profile.email}</p>
      <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
    </>
  );
};

export default ProfileSidebar;
