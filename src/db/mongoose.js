const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  "mongodb+srv://codeforall:codeforall@cluster0.thl3ihl.mongodb.net/test",
  {
    useNewUrlParser: true,
    // useCreateIndex: true
  }
);
