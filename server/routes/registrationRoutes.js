const express = require('express');
const { createRegistration, getAllRegistrations, getUserRegistrations, updateRegistration, updateUserRegistrationDate, getUserRegistration, getUserRegistrationDate, cancelUserRegistration} = require('../controlers/registrationControler');
const { protect, allowAccessTo } = require('../controlers/authControler');

const router = express.Router();


router.route('/')

  .post(protect, createRegistration)
  .get(protect, allowAccessTo('admin'), getAllRegistrations);

router.route('/registrations')
.get(protect,getUserRegistrations);

router.route('/:id')

.get( protect, getUserRegistration)

.patch(protect,updateRegistration);

router.route('/:id/date')
.get(protect, getUserRegistrationDate)
.patch(protect, updateUserRegistrationDate);

router.route("/:id/cancel").patch(protect, cancelUserRegistration);

module.exports = router;