const router = require('express').Router();

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
router.get('/users/:userId', getUserId);

// обновляет профиль
router.patch('/users/me', updateUserProfile);

// обновляет аватар
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
