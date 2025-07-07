const { createBookmark, deleteBookmark, getUserBookmarks, checkBookmarkExists } = require('../models/bookmarkModel');

exports.addBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tourId = parseInt(req.params.tourId, 10);

    if (isNaN(tourId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Netinkamas tourId',
      });
    }

    const existingBookmark = await checkBookmarkExists(userId, tourId);
    if (existingBookmark) {
      return res.status(400).json({
        status: 'fail',
        message: 'Ekskursija jau yra jūsų bookmarkuose',
      });
    }

    const bookmark = await createBookmark(userId, tourId);

    res.status(201).json({
      status: 'success',
      data: bookmark,
    });
  } catch (error) {
    console.error('Klaida pridedant bookmark:', error);
    next(error);
  }
};

exports.removeBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tourId = parseInt(req.params.tourId, 10);

    if (isNaN(tourId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Netinkamas tourId',
      });
    }

    const bookmark = await deleteBookmark(userId, tourId);
    if (!bookmark) {
      return res.status(404).json({
        status: 'fail',
        message: 'Bookmark nerastas',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Bookmark pašalintas',
    });
  } catch (error) {
    console.error('Klaida pašalinant bookmark:', error);
    next(error);
  }
};

exports.getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await getUserBookmarks(userId);

    res.status(200).json({
      status: 'success',
      data: bookmarks,
    });
  } catch (error) {
    console.error('Klaida gaunant bookmarks:', error);
    next(error);
  }
};