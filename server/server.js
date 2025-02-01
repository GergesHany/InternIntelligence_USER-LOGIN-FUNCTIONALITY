require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = require('./config/corsOptions');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
});

app.use(limiter);
app.use(cors(corsOptions)); // CORS middleware
app.use(cookieParser()); // Cookie parser middleware
app.use(express.json()); // Body parser middleware

// Routes setup
app.use('/', require('./routes/root'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));

// 404 handling for undefined routes
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    const file = path.join(__dirname, 'views/404.html');
    return res.sendFile(file);
  } else if (req.accepts('json')) {
    return res.json({ error: 'Not found' });
  } else {
    res.type('txt').send('Not found');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const Pool = require('./config/dbConn.js');
Pool.connect()
  .then((client) => {
    console.log('Connected to PostgreSQL');
    client.release(); // Don't forget to release the client when you're done
  })
  .catch((err) => {
    console.error('Connection error', err.stack);
  });

module.exports = app;
