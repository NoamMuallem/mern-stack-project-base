const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Recipe = require("../../models/Recipe");

//global users for testing
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "rony",
  email: "rosmy@gmail.com",
  password: "bugobugobugo",
};
const userOneToken = jwt.sign({ _id: userOneId }, "bugovnkl44");

//global items for testing
const recipeOne = {
  _id: new mongoose.Types.ObjectId(),
  name: "spagetty",
  ingredients: [
    { name: "pasta", unit: "grams", amount: "500" },
    { name: "tommatos", unit: "units", amount: "5" },
  ],
  directions: "just cook everything togather you dumb fuck!",
  notes: "becarefull not to burn it!!!",
  tags: ["easy", "quick", "veagan"],
  owner: userOneId,
};

const recipeTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: "soupe",
  ingredients: [
    { name: "cary", unit: "spoons", amount: "3" },
    { name: "tommatos", unit: "units", amount: "5" },
  ],
  directions: "just cook everything togather you dumb fuck!",
  notes: "becarefull not to burn it!!!",
  tags: ["easy", "veagan", "cheap"],
  owner: userOneId,
};

const recipeThree = {
  _id: new mongoose.Types.ObjectId(),
  name: "mix vedge",
  ingredients: [
    { name: "pepper", unit: "grams", amount: "200" },
    { name: "tommatos", unit: "units", amount: "5" },
  ],
  directions: "just cook everything togather you dumb fuck!",
  notes: "becarefull not to burn it!!!",
  tags: ["easy", "quick", "veagan"],
  owner: userOneId,
};

const setupDatabase = async () => {
  //droping db and inserting one test user
  try {
    await User.deleteMany();
    const u1 = await new User(userOne).save();
    await Recipe.deleteMany();
    const r1 = await new Recipe(recipeOne).save();
    const r2 = await new Recipe(recipeTwo).save();
    const r3 = await new Recipe(recipeThree).save();
    await r1.addTagsToUser(u1);
    await r2.addTagsToUser(u1);
    await r3.addTagsToUser(u1);
  } catch (e) {}
};

module.exports = {
  userOneId,
  userOne,
  userOneToken,
  recipeOne,
  recipeTwo,
  recipeThree,
  setupDatabase,
};
