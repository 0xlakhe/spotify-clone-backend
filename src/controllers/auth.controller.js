const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  const { username, email, password, role = "user" } = req.body;

  //checking if user exists
  const userExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    res.status(409).json({
      message: "User exists",
    });
  }

  //hashing password
  const hash = await bcrypt.hash(password, 10);

  //creating new user
  const user = await userModel.create({
    username,
    email,
    password: hash,
    role,
  });

  //creating token using user's id
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );

  //sending token to cookie with name token
  res.cookie("token", token);

  res.status(201).json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      password: hash,
      role: user.role,
    },
  });
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;

  //checking if user exists again
  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  //decrypting password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "logged in ",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = { registerUser, loginUser };
