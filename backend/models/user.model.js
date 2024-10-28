const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String },
  email: { type: String },
  password: { type: String },
  createdOn: { type: Date, default: new Date().getTime() },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
// module.exports = mongoose.model("User");
