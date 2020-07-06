const { Router } = require("express");
const auth = require("../../middleware/auth");
// User Model
const User = require("../../models/User");

const router = Router();

/**
 * @route   POST api/auth/register
 * @desc    Register new user
 * @access  Public
 */

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  try {
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({
      user: user,
      token,
    });
  } catch (e) {
    res.status(400).send({ msg: "כתובת המייל כבר קיימת" });
  }
});

/**
 * @route   POST api/auth/login
 * @desc    Login user
 * @access  Public
 */

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({
      user,
      token,
    });
  } catch (e) {
    res.status(400).send({ msg: "שם משתמש או סיסמא שגויים" });
  }
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */

router.get("/user", auth, async (req, res) => {
  try {
    //send user from auth middleware back
    res.json(req.user);
  } catch (e) {
    //return 400 and massage
    res.status(400).json({ msg: "משתמש לא קיים" });
  }
});

/**
 * @route   Delete api/auth/user
 * @desc    Dlete user data
 * @access  Private
 */

router.delete("/user", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.json({ msg: "משתמש נמחק בהצלחה" });
  } catch (e) {
    //return 400 and massage
    res.status(400).json({ msg: "לא הייתה אפשרות למחוק את המשתמש" });
  }
});

module.exports = router;
