const card = require("../models/card");

//возвращает все карточки
getCards = (req, res) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

//создает карточку
createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  card
    .create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

//удаляет карточку
deleteCard = (req, res) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

//поставить лайк карточке
putLikes = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
};

//убрать лайк с карточки
deleteLikes = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
};

module.exports = {
  getCards,
  createCard,
  createCard,
  deleteCard,
  putLikes,
  deleteLikes,
};
