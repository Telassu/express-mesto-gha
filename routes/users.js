const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const regex = /(https?:\/\/)([www.]?[a-zA-Z0-9-]+\.)([^\s]{2,})/;

const {
  getUsers,
  getUserId,
  getUserMe,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/users', getUsers);

// возвращает информацию о текущем пользователе
router.get('/users/me', getUserMe);

// возвращает пользователя по _id
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required().hex(),
  }),
}), getUserId);

// обновляет профиль
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

// обновляет аватар
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regex),
  }),
}), updateUserAvatar);

module.exports = router;
