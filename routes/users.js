const router = require('express').Router();

const {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/users', getUsers);

// возвращает пользователя по _id
router.get('/users/:userId', getUserId);

// создает пользователя
router.post('/users', createUser);

// обновляет профиль
router.patch('/users/me', updateUserProfile);

// обновляет аватар
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
