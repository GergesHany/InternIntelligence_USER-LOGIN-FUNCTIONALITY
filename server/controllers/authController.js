const Pool = require('../config/dbConn');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// RETURNING -> returns the newly created user
const queryInsert = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';

const querySelectByEmail = 'SELECT * FROM users WHERE email = $1';

const getUserByEmail = async (email) => {
  const user = await Pool.query(querySelectByEmail, [email]);
  if (user.rows.length === 0) {
    return null;
  }
  return user.rows[0];
};

const logout = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ message: 'Logged out' });
};

const login = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json('Please fill all fields');
  }

  const user = await getUserByEmail(email);
  if (user === null) {
    return res.status(400).json('Invalid credentials');
  }

  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json('Invalid credentials');
    }

    const AccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
      expiresIn: '15 minutes',
    });

    const RefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN, {
      expiresIn: '7d',
    });

    res.cookie('jwt', RefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      AccessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json('Server Error');
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json('Please fill all fields');
  }

  const user = await getUserByEmail(email);
  if (user !== null) {
    return res.status(400).json('User already exists');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Pool.query(queryInsert, [name, email, hashedPassword]);

    const AccessToken = jwt.sign({ id: newUser.rows[0].id }, process.env.ACCESS_TOKEN, {
      expiresIn: '15m',
    });

    const RefreshToken = jwt.sign({ id: newUser.rows[0].id }, process.env.REFRESH_TOKEN, {
      expiresIn: '7d',
    });

    res.cookie('jwt', RefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      AccessToken,
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
      },
    });
  } catch (err) {
    console.log('Error: ', err.message);
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { register, login, logout };
