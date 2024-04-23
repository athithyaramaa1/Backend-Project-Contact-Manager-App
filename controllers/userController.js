const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
//@desc Register a user
//route POST /api/users/register
//@access PUBLIC

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All feilds are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }
  //Hash password = bcrypt.hash(thePassword, numberOfSaltRounds)
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password is: ", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`User created: ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login user
//route POST /api/users/login
//@access PUBLIC

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All the fields are mandatory");
  }
  const user = await User.findOne({ email });
  //compare password with hashPassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign({
      //payload
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
    }, process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: "50m"});
    res.status(200).json({ accessToken });
  }else{
    res.status(401)
    throw new Error("Credentials provided are incorrect")
  }
});

//@desc Current user info
//route GET /api/users/register
//@access PRIVATE

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
