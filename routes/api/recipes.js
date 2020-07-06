const { Router } = require("express");
const auth = require("../../middleware/auth");
// Recipe Model
const Recipe = require("../../models/Recipe");

const router = Router();

/**
 * @route   GET api/recipes
 * @desc    Get User Recipes
 * @access  Private
 */

router.get("/", auth, async (req, res) => {
  try {
    await req.user.populate("recipes").execPopulate();
    res.send(req.user.recipes);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

/**
 * @route   POST api/recipes
 * @desc    Create An Recipe
 * @access  Private
 */

router.post("/", auth, async (req, res) => {
  const recipe = new Recipe({
    ...req.body, //copy over all the fileds from req.body to the object
    owner: req.user._id,
  });

  try {
    await recipe.save();
    await recipe.addTagsToUser(req.user);
    res.status(201).send(recipe);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @route   DELETE api/recipes/:id
 * @desc    Delete A Recipe
 * @access  Private
 */

router.delete("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    await recipe.removeTagsFromUser(req.user);
    await Recipe.findOneAndDelete({ _id: req.params.id });
    res.send({ msg: "succeess" });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

/**
 * @route   Patch api/recipes/:id
 * @desc    Update A Recipe
 * @access  Private
 */

//TODO:make it more efficient
router.patch("/:id", auth, async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    recipe.removeTagsFromUser(req.user);
    await Recipe.findOneAndUpdate({ _id: req.params.id }, { ...req.body });
    recipe = await Recipe.findById(req.params.id);
    recipe.addTagsToUser(req.user);
    res.send({ msg: "succeess" });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;
