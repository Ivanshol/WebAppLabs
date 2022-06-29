const { Schema, model } = require("mongoose");

const User = new Schema({
  email: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female"] },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["online", "offline"],
    default: "offline"
  },
  roles: [{ type: String, ref: "Role" }]
});

module.exports = model("User", User);
