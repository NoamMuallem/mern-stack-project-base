const dotenv = require("dotenv");

dotenv.config();

module.export = {
  PORT: 5000,
  MONGO_URI: "MONGODB_URL=mongodb://127.0.0.1:27017",
  MONGO_DB_NAME: "mern",
  JWT_SECRET: "bugovnkl44",
};
