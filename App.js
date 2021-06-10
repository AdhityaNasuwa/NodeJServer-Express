const express = require("express");
const router = require("./src/Routers");
const app = new express();

app.use(router);
app.listen(2502, () => {
  console.log("running on port http://localhost:2502/");
});
