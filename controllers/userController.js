const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const register = asyncHandler(async (req, res) => {
  const { email, password, username, gender } = req.body;
  if (!email || !password || !username || !gender) {
    res.status(200).send({
      error: "Pass email, password, username and gender!",
      status: false,
    });
    return;
  }

  const userWithEmail = await User.findOne({ email });
  const userWithName = await User.findOne({ username });

  if (userWithEmail) {
    res.status(200).send({
      error: "Email already exists",
      status: false,
    });
    return;
  }
  if (userWithName) {
    res.status(200).send({
      error: "Username already exists",
      status: false,
    });
    return;
  }

  const newUser = await User.create({
    email,
    password,
    username,
    gender,
    isPrimeUser: false,
  });

  if (newUser) {
    res.status(200).send({
      data: {
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        gender: newUser.gender,
        isPrimeUser: newUser.isPrimeUser,
        token: generateToken(newUser._id),
      },
      status: true,
    });
  } else {
    res.status(200).json({
      error: "Failed to create a user!",
      status: false,
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { password, username } = req.body;

    const user = await User.findOne({ email:username });
    if(!user){
        const userNameUser = await User.findOne({ username: username });
        if(userNameUser && (await userNameUser.matchPassword(password))){
            res.status(200).send({
              data: {
                _id: userNameUser._id,
                email: userNameUser.email,
                username: userNameUser.username,
                gender: userNameUser.gender,
                isPrimeUser: userNameUser.isPrimeUser,
                token: generateToken(userNameUser._id),
              },
              status: true,
            });
        }else{
            res.status(200).json({
              error: "User not found!",
              status: false,
            });
        }
    }else{
        if (user && (await user.matchPassword(password))) {
          res.status(200).send({
            data: {
              _id: user._id,
              email: user.email,
              username: user.username,
              gender: user.gender,
              isPrimeUser: user.isPrimeUser,
              token: generateToken(user._id),
            },
            status: true,
          });
        } else {
          res.status(200).json({
            error: "Invalid Username or password!",
            status: false,
          });
        }
    }
});

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    data:req.user,
    status: false,
  });
})

module.exports = { register, login, getUser };
