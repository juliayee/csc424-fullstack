const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6, // You can adjust the minimum length as needed
    },
    token: {
      type: String,
      require: true,
      trim: true,
    },
  },
  { collection: "users_list" }
);

module.exports = mongoose.model("User", UserSchema);