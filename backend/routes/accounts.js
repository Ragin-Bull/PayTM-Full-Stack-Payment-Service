const express = require("express");
const accountRouter = express.Router();
const authMiddleware = require("../middlewares/index.js");
const Account = require("../models/account.models.js");
const mongoose = require("mongoose");

accountRouter.get("/balance", authMiddleware, async function (req, res) {
  const userId = req.userId;
  const account = await Account.findOne({
    userId: userId,
  });
  if (account) {
    return res.json({
      balance: account.balance,
    });
  } else {
    return res.status(404).json({
      message: "Account not found",
    });
  }
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const amount = req.body.amount;
  const to = req.body.to;

  // Fetch the accounts within the transaction -> from
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  // Logic if account balance is less or if the account doesn't exist then abort the transaction entirely
  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Account not found or Insufficient balance",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  // Perform the transfer
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  // Commit the transaction
  await session.commitTransaction();

  res.json({
    message: "Transaction successful",
  });
});

module.exports = accountRouter;
