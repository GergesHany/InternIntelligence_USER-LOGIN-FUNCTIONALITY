const authController = require('../controllers/authController');
const express = require('express');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('*', (request, response) => {
  response.status(404).json('Not Found');
});

module.exports = router;
