import React from "react";
import NavBar from "./components/navbar/navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Signup from "./pages/signup";
import BlogDetails from "./pages/content";
import EditProfile from "./pages/editprofile";
function App() {
  return (
    <div className="App">
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/blogs/:id" element={<BlogDetails />} />
      </Routes>
    </div>
  );
}

export default App;
