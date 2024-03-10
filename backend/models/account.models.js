const mongoose = require("mongoose");
const { connectDb } = require("../connections/db.js");
const User = require("./user.models.js");

connectDb();

const accountSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
