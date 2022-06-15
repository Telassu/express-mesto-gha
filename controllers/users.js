const user = require("../models/user");

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SOME_ERROR = 500;

//возвращает всех пользователей
getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        return res.status(SOME_ERROR).send({ message: "Ошибка по умолчанию" });
      }
    });
};

//возвращает пользователя по _id
getUserId = (req, res) => {
  user
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: "Пользователь с указанным _id не найден" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({
            message: "Переданы некорректные данные при создании пользователя",
          });
      } else {
        return res.status(SOME_ERROR).send({ message: "Ошибка по умолчанию" });
      }
    });
};

//создает пользователя
createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        return res.status(SOME_ERROR).send({ message: "Ошибка по умолчанию" });
      }
    });
};

//обновляет профиль
updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  user
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      }
      if (err.name === "CastError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Пользователь с указанным _id не найден" });
      } else {
        return res.status(SOME_ERROR).send({ message: "Ошибка по умолчанию" });
      }
    });
};

//обновляет аватар
updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  user
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      }
      if (err.name === "CastError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Пользователь с указанным _id не найден" });
      } else {
        return res.status(SOME_ERROR).send({ message: "Ошибка по умолчанию" });
      }
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
