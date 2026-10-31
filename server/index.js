require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// Blog is DB for all the blogs
const Blog = require("./models/blog");
//Profile is DB for all the profiles
const Profile = require("./models/profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//User is DB for login and signups
const User = require("./models/user");
const auth = require("./middleware/auth");
const Groq = require("groq-sdk").default;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


mongoose
  .connect("mongodb+srv://aashka:aashka19@cluster0.mvvrask.mongodb.net/blogDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 catch ALL requests
app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

app.get("/dashboard/blogs", auth, async (req, res) => {
  try {
    const blogs = (await Blog.find({ author: req.userId }));
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user blogs" });
  }
});


app.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "email");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
});


app.get("/profile", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      return res.json(null);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});


 app.post("/ai/blog-assist", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    const text = completion.choices[0].message.content;

    res.json({ result: text });
  } catch (error) {
    console.error("GROQ ERROR:", error);
    res.status(500).json({
      error: error.message || "AI request failed",
    });
  }
});



app.post("/blogs", auth, async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    subject: req.body.subject,
    content: req.body.content,
    category: req.body.category,
    author: req.userId, // coming from token via auth middleware
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});


app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    await Profile.create({
      user: user._id,
      name,
      email,
      bio: "",
      avatar: "",
    });
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed" });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // req aaya to uski body m 2 cheeze thi email and password to vo email and password variable m store ho gya

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
     //hashes the password jo dala login krne ke liye and usko hashed password jo tha db m already us se compare kiya
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id },
      "secret_key",
      { expiresIn: "1d" }
    );
    // agar sab kuch thik raha to token bhej diya frontend ko to vo localStorage m store kr lega
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});
 

app.delete("/blogs/:id", auth, async (req, res) => {
  const blog = await Blog.findOne({
    _id: req.params.id,
    author: req.userId,
  });

  if (!blog) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await blog.deleteOne();
  res.json({ message: "Blog deleted" });
});


app.put("/blogs/:id",auth, async (req, res) => {
  try {
    const {id} = req.params;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update blog" });
  }
});


app.put("/profile", auth, async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.userId },
      req.body,
      { new: true }
    );

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});


const PORT = 8081;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
