const { createReviewModel, findExistingReview, getUserReviews, getReviewsByTourIdModel } = require("../models/reviewModel");

exports.leaveReview = async (req, res, next) => {
  try {
    const userId = req.user.id; // JWT middleware nustato req.user
    const tourId = parseInt(req.params.tourId, 10);
    if (isNaN(tourId)) {
      return res.status(400).json({ message: "Netinkamas tourId" });
    }

    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Reitingas turi būti tarp 1 ir 5." });
    }

    // Patikrinam, ar vartotojas jau paliko review šiam turui
    const existing = await findExistingReview(userId, tourId);
    if (existing) {
      return res.status(400).json({ message: "Jūs jau palikote atsiliepimą šiam turui." });
    }

    // Sukuriam review ir atnaujinam tūro reitingą (per modelį)
    const review = await createReviewModel(userId, tourId, rating, comment);

    res.status(201).json({
      message: "Atsiliepimas sėkmingai sukurtas.",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await getUserReviews(req.user.id);

    res.status(200).json({
      status: 'success',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};




exports.getTourReviews = async (req, res, next) => {
  try {
    const tourId = parseInt(req.params.tourId, 10);

    if (isNaN(tourId)) {
      return res.status(400).json({ message: "Netinkamas proceduros ID" });
    }

    const reviews = await getReviewsByTourIdModel(tourId);

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Klaida gaunant proceduros atsiliepimus:", error);
    next(error);
  }
};

