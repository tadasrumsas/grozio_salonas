const express = require("express");
const {
  leaveReview,
  getMyReviews,
  getProcedureReviews,
} = require("../controlers/reviewControler");
const { protect } = require("../controlers/authControler");

const router = express.Router();

router.get("/myreviews", protect, getMyReviews);
router.get("/procedures/:procedureId/reviews", getProcedureReviews);
router.post("/:procedureId", protect, leaveReview);

module.exports = router;
