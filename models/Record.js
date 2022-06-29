const { Schema, model } = require("mongoose");

const PhoneNumber = new Schema({
  alias: { type: String, required: true },
  value: { type: String, required: true }
});

const Record = new Schema({
  name: { type: String, required: true },
  phoneNumbers: {
    type: [PhoneNumber],
    required: true,
    validate: [val => val.length <= 10]
  },
  user: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = model("Record", Record);
