const mongoose = require("mongoose");

async function connectDb() {
  await mongoose.connect(
    "mongodb+srv://shatansh:EUTyg$wLC!xwnr5@cluster0.uajamzv.mongodb.net/backend"
  );
}

module.exports = {
  connectDb,
};
