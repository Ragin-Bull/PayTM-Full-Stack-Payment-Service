const mongoose = require("mongoose");

async function connectDb() {
  await mongoose.connect(process.env.DATABASE_URL);
}

module.exports = {
  connectDb,
};
