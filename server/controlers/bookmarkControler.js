const {
  createBookmark,
  deleteBookmark,
  getUserBookmarks,
  checkBookmarkExists,
} = require("../models/bookmarkModel");

exports.addBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const procedureId = parseInt(req.params.procedureId, 10);

    if (isNaN(procedureId)) {
      return res.status(400).json({
        status: "fail",
        message: "Netinkamas procedureId",
      });
    }

    const existingBookmark = await checkBookmarkExists(userId, procedureId);
    if (existingBookmark) {
      return res.status(400).json({
        status: "fail",
        message: "Ekskursija jau yra jūsų bookmarkuose",
      });
    }

    const bookmark = await createBookmark(userId, procedureId);

    res.status(201).json({
      status: "success",
      data: bookmark,
    });
  } catch (error) {
    console.error("Klaida pridedant bookmark:", error);
    next(error);
  }
};

exports.removeBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const procedureId = parseInt(req.params.procedureId, 10);

    if (isNaN(procedureId)) {
      return res.status(400).json({
        status: "fail",
        message: "Netinkamas procedureId",
      });
    }

    const bookmark = await deleteBookmark(userId, procedureId);
    if (!bookmark) {
      return res.status(404).json({
        status: "fail",
        message: "Bookmark nerastas",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Bookmark pašalintas",
    });
  } catch (error) {
    console.error("Klaida pašalinant bookmark:", error);
    next(error);
  }
};

exports.getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await getUserBookmarks(userId);

    res.status(200).json({
      status: "success",
      data: bookmarks,
    });
  } catch (error) {
    console.error("Klaida gaunant bookmarks:", error);
    next(error);
  }
};
