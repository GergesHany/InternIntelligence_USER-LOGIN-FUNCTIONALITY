const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  const file = path.join(__dirname, '../views/index.html');
  res.sendFile(file);
});

router.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

module.exports = router;
