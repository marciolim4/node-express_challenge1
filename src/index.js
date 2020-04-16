const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());

//Middleware to log my count of request
app.use(function (req, res, next) {
  console.count("Request");
  return next();
});

app.use(routes);

app.listen(3333, () => {
  console.log("Server is running");
});
