const user = require('./user');
const mongoose = require('mongoose');
const userModel = require('./user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

// uncomment the following line to view mongoose debug messages
mongoose.set("debug", true);

const url = process.env.MONGODB_URL;
console.log(url);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

async function getUsers() {
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
    const exists = await findUserByName(user.username);

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
    if (input.username && input.password) {
      const user = await findUserByName(input.username);

      if(!user){
        return;
      }
      else{
        // console.log("Checking passwords", input.password, "second", user.password);
        const validPassword = await bcrypt.compare(input.password, user.password);
        if (validPassword) {
          return user;
        } else {
          return undefined;
        } 
      }

    }
    else{
      return undefined;
    }    
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function findUserByName(name) {
  console.log(name);
  return await userModel.findOne({ username: name });
}

exports.getUsers = getUsers;
exports.addUser = addUser;
exports.authUser = authUser;
exports.findUserByName = findUserByName;