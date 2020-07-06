const request = require("supertest");
const app = require("../app");
const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");
const User = require("../models/User");
const {
  userOneId,
  userOne,
  userOneToken,
  recipeOne,
  recipeTwo,
  recipeThree,
  setupDatabase,
} = require("./fixtures/db");

beforeEach(setupDatabase);

beforeAll((done) => {
  done();
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});

test("add a recipe to user one", async (done) => {
  //response
  const response = await request(app)
    .post("/api/recipes")
    .set("X-Auth-Token", userOneToken)
    .send({
      name: "cheese cack",
      ingredients: [
        { name: "cotege cheese", unit: "gram", amount: "500" },
        { name: "pettybare", unit: "units", amount: "2" },
      ],
      directions: "just cook everything togather you dumb fuck!",
      notes: "becarefull not to burn it!!!",
      tags: ["easy", "salad", "veagan"],
    })
    .expect(201);

  //in db
  recipe = Recipe.findById(response._id);

  expect(recipe).not.toBeNull();

  //linked to user
  const user = await User.findById(userOneId);

  await user.populate("recipes").execPopulate();
  const userRecipe = user.recipes.filter((recipe) => {
    return String(recipe._id) === String(response.body._id);
  });
  expect(userRecipe.length).toBe(1);
  done();
});

test("should not let unothenticated user to add recipes", async (done) => {
  //response
  await request(app)
    .post("/api/recipes")
    .send({
      name: "cheese cack",
      ingredients: [
        { name: "cotege cheese", unit: "gram", amount: "500" },
        { name: "pettybare", unit: "units", amount: "2" },
      ],
      directions: "just cook everything togather you dumb fuck!",
      notes: "becarefull not to burn it!!!",
      tags: ["easy", "salad", "veagan"],
    })
    .expect(401);
  done();
});

test("add recipe coused adding user tag", async (done) => {
  //response
  await request(app)
    .post("/api/recipes")
    .set("X-Auth-Token", userOneToken)
    .send({
      name: "cheese cack",
      ingredients: [
        { name: "cotege cheese", unit: "gram", amount: "500" },
        { name: "pettybare", unit: "units", amount: "2" },
      ],
      directions: "just cook everything togather you dumb fuck!",
      notes: "becarefull not to burn it!!!",
      tags: ["easy", "salad", "veagan"],
    });

  let user = await User.findById(userOneId);
  expect(user.tags.length).toBe(5);
  done();
});

test("add recipe didn't coused adding user tag", async (done) => {
  //response
  await request(app)
    .post("/api/recipes")
    .set("X-Auth-Token", userOneToken)
    .send({
      name: "cheese cack",
      ingredients: [
        { name: "cotege cheese", unit: "gram", amount: "500" },
        { name: "pettybare", unit: "units", amount: "2" },
      ],
      directions: "just cook everything togather you dumb fuck!",
      notes: "becarefull not to burn it!!!",
      tags: ["easy", "quick", "veagan"],
    });

  let user = await User.findById(userOneId);
  expect(user.tags.length).toBe(4);
  done();
});

test("remove recipe coused user removing user tag", async (done) => {
  await request(app)
    .delete(`/api/recipes/${recipeTwo._id}`)
    .set("X-Auth-Token", userOneToken)
    .expect(200);

  const u1 = await User.findById(userOneId);

  expect(u1.tags.length).toBe(3);
  done();
});

test("remove recipe didn't coused user removing user tag", async (done) => {
  await request(app)
    .delete(`/api/recipes/${recipeThree._id}`)
    .set("X-Auth-Token", userOneToken)
    .expect(200);

  const u1 = await User.findById(userOneId);

  expect(u1.tags.length).toBe(4);
  done();
});

test("update recipe add tags no change to total amount", async (done) => {
  await request(app)
    .patch(`/api/recipes/${recipeOne._id}`)
    .set("X-Auth-Token", userOneToken)
    .send({
      tags: ["easy", "quick", "veagan", "cheap"],
    })
    .expect(200);

  const u1 = await User.findById(userOneId);

  expect(u1.tags.length).toBe(4);
  done();
});

test("update recipe add tags change total amount", async (done) => {
  await request(app)
    .patch(`/api/recipes/${recipeOne._id}`)
    .set("X-Auth-Token", userOneToken)
    .send({
      tags: ["easy", "quick", "veagan", "disert"],
    })
    .expect(200);

  const u1 = await User.findById(userOneId);

  expect(u1.tags.length).toBe(5);
  done();
});

test("update recipe remove tags no change to tags total", async (done) => {
  await request(app)
    .patch(`/api/recipes/${recipeOne._id}`)
    .set("X-Auth-Token", userOneToken)
    .send({
      tags: ["quick", "veagan"],
    })
    .expect(200);

  const u1 = await User.findById(userOneId);

  expect(u1.tags.length).toBe(4);
  done();
});

test("update recipe remove tags change tags total", async (done) => {
  await request(app)
    .patch(`/api/recipes/${recipeTwo._id}`)
    .set("X-Auth-Token", userOneToken)
    .send({
      tags: ["easy", "veagan"],
    })
    .expect(200);

  const u1 = await User.findById(userOneId);

  expect(u1.tags.length).toBe(3);
  done();
});
