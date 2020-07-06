const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const {
  userOneId,
  userOne,
  userOneToken,
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

test("should signup a new user", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "noam",
      email: "noamnoamnoam@example.com",
      password: "Mypass777!",
    })
    .expect(201);
  //assert db changed correctly
  const user = await User.findById(response.body.user["_id"]);
  expect(user).not.toBeNull();
  //asersions about the response
  expect(response.body.user["_id"]).toBe(String(user._id));
  expect(response.body.user["name"]).toBe("noam");
  expect(response.body.user["email"]).toBe("noamnoamnoam@example.com");
});

test("should login existing user", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  //verify token and token payload
  const token = response.body.token;
  const decoded = jwt.verify(token, "bugovnkl44");
  expect(String(decoded._id)).toBe(String(userOneId));
});

test("should not login bad user", async () => {
  await request(app)
    .post("/api/auth/login")
    .send({
      email: "badmail@bsmail.com",
      password: "incorrectPassword",
    })
    .expect(400);
});

test("should get profile for user", async () => {
  await request(app)
    .get("/api/auth/user")
    .set("X-Auth-Token", userOneToken)
    .send()
    .expect(200);
});

test("should not get profile for unaothenticated user", async () => {
  await request(app).get("/api/auth/user").send().expect(401);
});

test("should delete account for user", async () => {
  await request(app)
    .delete("/api/auth/user")
    .set("X-Auth-Token", userOneToken)
    .send()
    .expect(200);
});

test("should not delete account for unauthorized user", async () => {
  await request(app).delete("/api/auth/user").send().expect(401);
});
