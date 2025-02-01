const usersController = require('../controllers/usersController');
const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

router.get('/users', usersController.getAllUsers);
router.get('/user/:id', usersController.getUserById);
router.post('*', (request, response) => {
  response.status(404).json('Not Found');
});

module.exports = router;
