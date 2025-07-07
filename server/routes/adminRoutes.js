const express = require("express");
const {banUser, unbanUser, getUsers } = require('../controlers/adminControler');
const { protect, allowAccessTo } = require('../controlers/authControler');


const router = express.Router();
router.put("/ban/:id", protect, allowAccessTo("admin"), banUser);
router.put("/unban/:id", protect, allowAccessTo("admin"), unbanUser);
router.get("/all", protect, allowAccessTo("admin"), getUsers);

module.exports = router;
