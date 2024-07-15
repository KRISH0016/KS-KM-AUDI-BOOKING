const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
  },
  department: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcryptjs.genSalt();
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcryptjs.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Invalid Email");
};

const User = mongoose.model("User", userSchema);
module.exports = User;
