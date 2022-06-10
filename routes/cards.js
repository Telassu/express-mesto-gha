const router = require("express").Router();
const card = require("../models/card");

const {
  getCards,
  createCard,
  deleteCard,
  putLikes,
  deleteLikes,
} = require("../controllers/cards");

//возвращает все карточки
router.get("/cards", getCards);

//создает карточку
router.post("/cards", createCard);

//удаляет карточку
router.delete("/cards/:cardId", deleteCard);

//поставить лайк карточке
router.put("/cards/:cardId/likes", putLikes);

//убрать лайк с карточки
router.delete("/cards/:cardId/likes", deleteLikes);

module.exports = router;