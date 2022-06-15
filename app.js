const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

const logger = (req, res, next) => {
  res.send({ message: "Страница не найдена" });

  next();
};

app.use((req, res, next) => {
  req.user = {
    _id: "62a38baeddb6e27307a8b8bf",
  };

  next();
});

app.use(logger);
app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

app.listen(PORT, () => {
  console.log(`I'm listening port: ${PORT}`);
});
