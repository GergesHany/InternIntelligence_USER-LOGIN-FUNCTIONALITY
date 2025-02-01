const Pool = require('../config/dbConn');
const querySelectById = 'SELECT * FROM users WHERE id = $1';
const querySelectAll = 'SELECT * FROM users';

const getAllUsers = async (req, res) => {
  const users = await Pool.query(querySelectAll);
  res.json(users.rows);
};

const getUser = async (id) => {
  const user = await Pool.query(querySelectById, [id]);
  if (user.rows.length === 0) {
    return null;
  }
  return user.rows[0];
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await getUser(id);
  if (user === null) {
    return res.status(404).json('User not found');
  }
  res.json(user);
};

module.exports = {
  getUserById,
  getAllUsers,
};
