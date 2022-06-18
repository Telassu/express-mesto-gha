const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, SOME_ERROR } = require('../utils/errors');

// возвращает все карточки
const getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SOME_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

// создает карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card
    .create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } return res.status(SOME_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

// удаляет карточку
const deleteCard = (req, res) => {
  Card
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      } return res.status(SOME_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

// поставить лайк карточке
const putLikes = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      } return res.status(SOME_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

// убрать лайк с карточки
const deleteLikes = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      } return res.status(SOME_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLikes,
  deleteLikes,
};
