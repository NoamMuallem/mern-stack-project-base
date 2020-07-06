const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Recipe = require("./Recipe");
require("dotenv").config();

// Create Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tags: [
    {
      name: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
  ],
  shoppingList: [
    {
      name: {
        type: String,
        required: true,
      },
      unit: {
        type: String,
      },
      count: {
        type: Number,
      },
    },
  ],
  register_date: {
    type: Date,
    default: Date.now,
  },
});

//setting relationship between tasks and user, not an actual filed in user, therfore virtual
UserSchema.virtual("recipes", {
  ref: "Recipe", //just so mongoose can figur out what is owned by what and thair relations
  localField: "_id",
  foreignField: "owner", //he fileds that connects the 2 documents (like in sql keys)
});

//generating user authentication token SPECIFIC OBJECT METHODS LIVA IN METHODS
UserSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, process.env.TOKKEN_SECRET);

  return token;
};

//user login MODEL FUNCTION LIVE IN STATICS
UserSchema.statics.findByCredentials = async (email, password) => {
  //look for user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("unable to login");
  }
  //is was found by email, chack if password is like on the db
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to login");
  }
  return user;
};

//hash the plain text password
UserSchema.pre("save", async function (next) {
  const user = this;

  //if thar is a new password(by creating or updaing), we have to hash it:
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  //when we done, not gonne save the user if not called
  next();
});

//delete user tasks when user is removed
UserSchema.pre("remove", async function (next) {
  const user = this;
  await Recipe.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
