let mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://mybirth4:9479694757@cluster0-ahakv.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(function () {
    console.log("Database connected successfully");
  })
  .catch(function (err) {
    console.log(err.message);
  });