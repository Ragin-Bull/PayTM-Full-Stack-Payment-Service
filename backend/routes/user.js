const express = require("express");
const userRouter = express.Router();
const { User } = require("../models/user.models.js");
const zod = require("zod");
const JWT_SECRET = require("../config/index.js");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/index.js");
const Account = require("../models/account.models.js");

const signupSchema = zod.object({
  username: zod.string(),
  password: zod.string().min(6),
  firstName: zod.string(),
  lastName: zod.string(),
});

const signinSchema = zod.object({
  username: zod.string(),
  password: zod.string().min(6),
});

const updateSchema = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

userRouter.post("/signup", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const result = signupSchema.safeParse({
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
  });
  console.log(result.success);
  if (result.success) {
    const existingUser = await User.findOne({
      username: username,
    });

    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken",
      });
    }

    const user = await User.create({
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    let balance = Math.floor(Math.random() * 10000 + 1);

    const account = await Account.create({
      userId: user._id,
      balance: balance,
    });

    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    return res.status(200).json({
      message: "User created successfully",
      token: "jwt",
    });
  } else {
    console.log(req.body);
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
});

userRouter.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const result = signinSchema.safeParse({
    username,
    password,
  });

  if (!result.success) {
    return res.status(411).json({
      message: "Incorrect Inputs",
    });
  }

  const user = await User.findOne({
    username: username,
    password: password,
  });

  if (!user) {
    return res.status(404).json({
      message: "No user found, please signin first or incorrect credentials",
    });
  } else {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    return res.status(200).json({
      token: token,
    });
  }
});

userRouter.put("/", authMiddleware, async function (req, res) {
  const result = updateSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  } else {
    const user = await User.updateOne({ _id: req.userId }, req.body);

    return res.json({
      message: "Updated successfully",
    });
  }
});

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  return res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = userRouter;
