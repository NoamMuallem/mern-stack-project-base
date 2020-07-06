const mongoose = require("mongoose");
const User = require("./User");

// Create Schema
const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  directions: { type: String },
  notes: { type: String },
  tags: [
    {
      type: String,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User", // needs to be identical to the name we gave in the user model file when we defined mongoose.model('User',userSchema)
  },
});

//TODO: add and remove tags needs tobe in achema pre and after to bemore effitient
//TODO: add a schema pre and after update to update user tags accordingly

RecipeSchema.methods.addTagsToUser = async function (user) {
  let userTags = [...user.tags];
  let userTagNames = userTags.map((tag) => tag.name);
  this.tags.forEach((tag) => {
    let matchInedx = userTagNames.indexOf(tag);
    if (matchInedx < 0) {
      userTags.push({ name: tag, amount: 1 });
    } else {
      userTags[matchInedx] = {
        name: userTags[matchInedx].name,
        amount: userTags[matchInedx].amount + 1,
      };
    }
  });
  try {
    user.tags = userTags;
    await user.save();
  } catch (e) {
    throw new Error("could not update tags");
  }
};

RecipeSchema.methods.removeTagsFromUser = async function (user) {
  try {
    let userTags = [...user.tags];
    let userTagNames = userTags.map((tag) => tag.name);
    this.tags.forEach((tag) => {
      let matchInedx = userTagNames.indexOf(tag);
      if (userTags[matchInedx].amount === 1) {
        userTags.splice(matchInedx, 1);
        userTagNames.splice(matchInedx, 1);
      } else {
        userTags[matchInedx] = {
          name: userTags[matchInedx].name,
          amount: userTags[matchInedx].amount - 1,
        };
      }
    });
    user.tags = userTags;
    await user.save();
  } catch (e) {
    throw new Error("could not update tags");
  }
};

const Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe;
