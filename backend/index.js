const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
const rootRouter = require("./routes/index.js");
const userRouter = require("./routes/user.js");
const accountRouter = require("./routes/accounts.js");

app.use(express.json());
app.use(cors());
app.use("/api/v1", rootRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
