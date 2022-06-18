const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, SOME_ERROR } = require('../utils/errors');

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
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
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

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
