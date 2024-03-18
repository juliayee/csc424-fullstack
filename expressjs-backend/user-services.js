const user = require('./user');
const mongoose = require('mongoose');
const userModel = require('./user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// uncomment the following line to view mongoose debug messages
mongoose.set("debug", true);

const url = process.env.MONGODB_URL;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

async function getUsers(name, job) {
  try {
    const users = await userModel.find({});
    return users.map(user => {
      return {
        username: user.username,
        emaiL: user.email,
      };
    });
  }
  catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addUser(user) {
  try {
    const exists = await findUserByName(user.user);

    if (exists == []) {
      console.log("User Already exists");
      return false;
    }

    const userToAdd = new userModel(user);
    const savedUser = await userToAdd.save();
    return savedUser;
  }
  catch (error) {
    console.log(error);
    return false;
  }
}

async function authUser(input) {
  try {
    if (!input.username || !input.password) {
      return undefined;
    }

    const user = await findUserByName(input.username);
    if (user.length === 0) {
      return undefined;
    }

    const isValidPassword = await bcrypt.compare(input.password, user[0].password);
    if (isValidPassword) {
      return user[0];
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function findUserByName(name) {
  console.log(name);
  return await userModel.find({ username: name });
}

exports.getUsers = getUsers;
exports.addUser = addUser;
exports.authUser = authUser;
exports.findUserByName = findUserByName;