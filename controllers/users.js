const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SOME_ERROR,
  UNAUTHORIZED,
} = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

// возвращает всех пользователей
const getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SOME_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

// возвращает пользователя по _id
const getUserId = (req, res) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Передан некорректный _id пользователя',
        });
      } return res.status(SOME_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

// создает пользователя
const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } return res.status(SOME_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

// обновляет профиль
const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } if (err.name === 'CastError') {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      } return res.status(SOME_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

// обновляет аватар
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } if (err.name === 'CastError') {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      } return res.status(SOME_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

// аутентификация пользователя
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 360000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ message: 'Всё прошло успешно!' });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};
