const {
  createReviewModel,
  findExistingReview,
  getUserReviews,
  getReviewsByProcedureIdModel,
} = require("../models/reviewModel");

exports.leaveReview = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const procedureId = parseInt(req.params.procedureId, 10);
    if (isNaN(procedureId)) {
      return res.status(400).json({ message: "Netinkamas procedureId" });
    }

    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Reitingas turi būti tarp 1 ir 5." });
    }

  
    const existing = await findExistingReview(userId, procedureId);
    if (existing) {
      return res
        .status(400)
        .json({ message: "Jūs jau palikote atsiliepimą šiam turui." });
    }

  
    const review = await createReviewModel(
      userId,
      procedureId,
      rating,
      comment
    );

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
      status: "success",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProcedureReviews = async (req, res, next) => {
  try {
    const procedureId = parseInt(req.params.procedureId, 10);

    if (isNaN(procedureId)) {
      return res.status(400).json({ message: "Netinkamas proceduros ID" });
    }

    const reviews = await getReviewsByProcedureIdModel(procedureId);

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Klaida gaunant proceduros atsiliepimus:", error);
    next(error);
  }
};
