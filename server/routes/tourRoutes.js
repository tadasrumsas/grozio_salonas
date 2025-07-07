const express = require('express');
const { createTour, getAllTours, updateTour, deleteTour, getTourById } = require('../controlers/tourControler');

const validate = require('../validators/validate');
const { protect, allowAccessTo } = require('../controlers/authControler');
const validateCreateTour = require('../validators/createTour');


const router = express.Router();


router.route('/')

  .post(protect, allowAccessTo('admin'), validateCreateTour, validate, createTour)
  .get(getAllTours);

router.route('/:id')
.patch(protect, allowAccessTo('admin'),updateTour)
.get(protect,allowAccessTo('admin'),getTourById)
.delete(protect, allowAccessTo('admin'),deleteTour);

router.route('/tour/:id')
.get(getTourById);

module.exports = router;