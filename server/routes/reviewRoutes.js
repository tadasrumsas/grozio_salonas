const express = require("express");
const { leaveReview, getMyReviews, getTourReviews } = require("../controlers/reviewControler");
const { protect } = require('../controlers/authControler');

const router = express.Router();

router.get("/myreviews", protect, getMyReviews)
router.get("/tours/:tourId/reviews", getTourReviews);
router.post("/:tourId", protect, leaveReview)

module.exports = router;
