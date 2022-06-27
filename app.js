require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

const logger = (req, res, next) => {
  res.status(404).send({ message: 'Страница не найдена' });

  next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res, next) => {
  req.user = {
    _id: '62a38baeddb6e27307a8b8bf',
  };

  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use(logger);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`I'm listening port: ${PORT}`);
});
