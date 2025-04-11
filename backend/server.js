"use strict";

require("dotenv").config();
const cors = require("cors");

const app = require("./app");
const { PORT } = require("./config");

app.use(cors());

app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});

