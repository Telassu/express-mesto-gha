const Card = require('../models/card');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');

// возвращает все карточки
const getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch((next));
};

// создает карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card
    .create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

// удаляет карточку
const deleteCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Недостаточно прав для удаления карточки');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch((next));
};

// поставить лайк карточке
const putLikes = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((next));
};

// убрать лайк с карточки
const deleteLikes = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((next));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLikes,
  deleteLikes,
};
