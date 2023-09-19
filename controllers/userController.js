const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const register = asyncHandler(async (req, res) => {
  const { email, password, username, gender, name } = req.body;
  const { byGoogle } = req.query;
  let newUser;

  if(byGoogle) {
      const userWithEmail = await User.findOne({ email });
      if (userWithEmail) {
          userWithEmail.byGoogle = true;
          userWithEmail.save();
          res.status(200).send({
            data: {
              _id: userWithEmail._id,
              email: userWithEmail.email,
              username: userWithEmail.username,
              gender: userWithEmail?.gender,
              isPrimeUser: userWithEmail.isPrimeUser,
              byGoogle: userWithEmail.byGoogle,
              token: generateToken(userWithEmail._id),
            },
            status: true,
          });
          return;
      }
      let newUsername = generateUniqueUsername(name);
      newUser = await User.create({
        email,
        username:newUsername,
        byGoogle: true,
        isPrimeUser: false,
      });
  }
  else{
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
    
    newUser = await User.create({
      email,
      password,
      username,
      gender,
      byGoogle:false,
      isPrimeUser: false,
    });  
  }

  if (newUser) {
    res.status(200).send({
      data: {
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        gender: newUser?.gender,
        isPrimeUser: newUser.isPrimeUser,
        byGoogle: newUser.byGoogle,
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

function generateUniqueUsername(name) {
  const usernameWithoutSpaces = name.replaceAll(" ", "");
  const uniqueIdentifier = Math.random().toString(36).substring(2, 8); // Generates a random 6-character alphanumeric string
  return usernameWithoutSpaces + uniqueIdentifier;
}

module.exports = { register, login, getUser };
