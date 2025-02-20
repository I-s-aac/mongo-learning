const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const mongoose = require("mongoose");
const dbURI = process.env.DB_URI || "mongodb://localhost:27017/test";
mongoose.connect(dbURI);
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("database connected");
});

// schema for collection X with mongoose
const User = mongoose.Schema({
  name: String,
  role: String,
  age: Number,
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("User", User);

app.post("/users", async (req, res) => {
  const user = new UserModel(req.body);
  try {
    const result = await user.save();
    res.send(result);
    console.log(result);
  } catch (err) {
    res.status(500).send();
  }
});

// get all users
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get all users
app.get("/users/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const users = await UserModel.find({ name: name });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
