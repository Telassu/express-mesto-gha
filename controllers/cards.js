const card = require("../models/card");

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SOME_ERROR = 500;

//возвращает все карточки
getCards = (req, res) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        return res.status(SOME_ERROR).send({ message: "Ошибка по умолчанию" });
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
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        return res.status(SOME_ERROR).send({ message: "Ошибка по умолчанию" });
      }
    });
};

//удаляет карточку
deleteCard = (req, res) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена" });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные",
        });
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
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена" });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      } else {
        return res.status(SOME_ERROR).send({ message: "Ошибка по умолчанию" });
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
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена" });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные для снятия лайка",
        });
      } else {
        return res.status(SOME_ERROR).send({ message: "Ошибка по умолчанию" });
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
