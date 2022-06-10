const user = require("../models/user");

//возвращает всех пользователей
getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

//возвращает пользователя по _id
getUserId = (req, res) => {
  user
    .findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

//создает пользователя
createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

//обновляет профиль
updateUserProfile = (req, res) => {
  const {name, about} = req.body;

  user
    .findByIdAndUpdate(req.user._id, { name, about }, {
      new: true, 
      runValidators: true,
      upsert: true 
  })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

//обновляет аватар
updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  user
    .findByIdAndUpdate(req.user._id, { avatar }, {
      new: true, 
      runValidators: true,
      upsert: true 
  })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar
}