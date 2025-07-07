const {
  banUserById,
  unbanUserById,
  getAllUsers,
} = require("../models/adminModel");

exports.banUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await banUserById(userId);
    res.status(200).json({ message: "Vartotojas užblokuotas." });
  } catch (err) {
    next(err);
  }
};

exports.unbanUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await unbanUserById(userId);
    res.status(200).json({ message: "Vartotojas atblokuotas." });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
