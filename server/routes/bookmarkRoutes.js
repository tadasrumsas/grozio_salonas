const express = require('express');
const { addBookmark, removeBookmark, getUserBookmarks } = require('../controlers/bookmarkControler');
const { protect } = require('../controlers/authControler');

const router = express.Router();

router
  .route('/:tourId')
  .post(protect, addBookmark)
  .delete(protect, removeBookmark);

router.route('/').get(protect, getUserBookmarks);

module.exports = router;