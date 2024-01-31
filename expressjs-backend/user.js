const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    job: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error("Invalid job, must be at least 2 characters.");
      },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6, // You can adjust the minimum length as needed
      },
      token: {
        type: String,
      },
  },
  { collection: "users_list" }
);

module.exports = mongoose.model("User", UserSchema);