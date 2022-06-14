const user = require("../models/user");

//возвращает всех пользователей
getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      if (res.status === 400) {
        res.send({
          message: "Переданы некорректные данные при создании пользователя",
        });
        return;
      } else if (res.status === 500) {
        res.send({ message: "Ошибка по умолчанию" });
        return;
      }
    });
};

//возвращает пользователя по _id
getUserId = (req, res) => {
  user
    .findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch(() => {
      if (res.status === 404) {
        res.send({ message: "Пользователь с указанным _id не найден" });
        return;
      } else if (res.status === 500) {
        res.send({ message: "Ошибка по умолчанию" });
        return;
      }
    });
};

//создает пользователя
createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      if (res.status === 400) {
        res.send({
          message: "Переданы некорректные данные при создании пользователя",
        });
        return;
      } else if (res.status === 500) {
        res.send({ message: "Ошибка по умолчанию" });
        return;
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
    .catch(() => {
      if (res.status === 400) {
        res.send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
        return;
      } else if (res.status === 404) {
        res.send({ message: "Пользователь с указанным _id не найден" });
        return;
      } else if (res.status === 500) {
        res.send({ message: "Ошибка по умолчанию" });
        return;
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
    .catch(() => {
      if (res.status === 400) {
        res.send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
        return;
      } else if (res.status === 404) {
        res.send({ message: "Пользователь с указанным _id не найден" });
        return;
      } else if (res.status === 500) {
        res.send({ message: "Ошибка по умолчанию" });
        return;
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
