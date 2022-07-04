const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

// возвращает всех пользователей
const getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// возвращает пользователя по _id
const getUserId = (req, res, next) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователя не существует');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// возвращает информацию о текущем пользователе
const getUserMe = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователя не существует');
      }
      res.send({ data: user });
    })
    .catch(next);
};

// создает пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  const user = User.findOne({ email });
  if (user) {
    throw new Conflict(`Пользователь ${email} уже существует`);
  } else {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then(() => res.send({ name, about, avatar }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequest('Переданы некорректные данные при создании пользователя'));
        } else {
          next(err);
        }
      });
  }
};

// обновляет профиль
const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователя не существует');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при редактировании пользователя'));
      } else {
        next(err);
      }
    });
};

// обновляет аватар
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователя не существует');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при редактировании аватара пользователя'));
      } else {
        next(err);
      }
    });
};

// аутентификация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 360000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ message: 'Все прошло успешно!' });
    })
    .catch(() => {
      next(new Unauthorized('Неправильный email или пароль'));
    });
};

module.exports = {
  getUsers,
  getUserId,
  getUserMe,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};
