const card = require("../models/card");

//возвращает все карточки
getCards = (req, res) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      if (res.status === 400) {
        res.send({
          message: "Переданы некорректные данные при создании карточки",
        });
        return;
      } else if (res.status === 500) {
        res.send({ message: "Ошибка по умолчанию" });
        return;
      }
    });
};

//создает карточку
createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  card
    .create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (res.status === 400) {
        res.send({
          message: "Переданы некорректные данные при создании карточки",
        });
        return;
      } else if (res.status === 500) {
        res.send({ message: "Ошибка по умолчанию" });
        return;
      }
    });
};

//удаляет карточку
deleteCard = (req, res) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (res.status === 404) {
        res.send({ message: "Карточка с указанным _id не найдена" });
        return;
      }
    });
};

//поставить лайк карточке
putLikes = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (res.status === 400) {
        res.send({
          message: "Переданы некорректные данные для постановки лайка",
        });
        return;
      } else if (res.status === 404) {
        res.send({ message: "Передан несуществующий _id карточки" });
        return;
      } else if (res.status === 500) {
        res.send({ message: "Ошибка по умолчанию" });
        return;
      }
    });
};

//убрать лайк с карточки
deleteLikes = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (res.status === 400) {
        res.send({
          message: "Переданы некорректные данные для постановки лайка",
        });
        return;
      } else if (res.status === 404) {
        res.send({ message: "Передан несуществующий _id карточки" });
        return;
      } else if (res.status === 500) {
        res.send({ message: "Ошибка по умолчанию" });
        return;
      }
    });
};

module.exports = {
  getCards,
  createCard,
  createCard,
  deleteCard,
  putLikes,
  deleteLikes,
};
