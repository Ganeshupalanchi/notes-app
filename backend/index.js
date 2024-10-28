require("dotenv").config();

const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

// DB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected."))
  .catch((error) => console.log(error));

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const User = require("./models/user.model");
const Note = require("./models/note.model");

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/", (req, res) => {
  res.json({ data: "Hello" });
});

// create user Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full name is required." });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required." });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required." });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.json({ error: true, message: "Email already exist." });
  }
  const hashPassword = await bycrypt.hash(password, 10);

  const user = new User({
    fullName: fullName.trim(),
    email,
    password: hashPassword,
  });
  await user.save();

  return res.json({
    error: false,
    user,
    // accessToken,
    message: "Registration Successfull",
  });
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  const userInfo = await User.findOne({ email });
  if (!userInfo) {
    return res.status(400).json({ message: "User not found." });
  }
  const passwordMatch = await bycrypt.compare(password, userInfo.password);

  if (userInfo.email == email && passwordMatch) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.json({
      error: false,
      message: "Login Successfull",
      email,
      accessToken,
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: "Invalid Credentials." });
  }
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.status(401);
  }
  return res.json({
    user: {
      _id: isUser._id,
      fullName: isUser.fullName,
      email: isUser.email,
      createdOn: isUser.createdOn,
    },
  });
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content Is required." });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });
    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal Server error.",
    });
  }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No Changes Provided." });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found." });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }
});

// Get Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }
});

//Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found." });
    }
    await Note.deleteOne({ _id: noteId });

    return res.json({ error: false, message: "Note deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }
});

// Update IsPinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found." });
    }

    // if (isPinned) note.isPinned = isPinned || false;
    note.isPinned = isPinned;
    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }
});

//Search notes

app.get("/search-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required." });
  }
  try {
    // const searchRegex = new RegExp(query, 'i');
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json(matchingNotes);
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
});
const port = process.env.PORT || 8000;
app.listen(port, () => console.log("server started at port : " + port));
// module.exports = app;
