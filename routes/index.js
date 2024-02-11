const express = require('express');

const router = express.Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const users = require('./users');
const movies = require('./movies');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use(users);
router.use(movies);

module.exports = router;
