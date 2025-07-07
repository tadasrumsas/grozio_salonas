const { createRegistrationModel, getAllRegistrationsModel,getUserRegistrationsModel, updateRegistrationModel, getUserRegistrationById, checkTourDateExists, updateRegistrationDate, getUserRegistrationDateModel } = require('../models/registrationModel');

exports.createRegistration = async (req, res, next) => {
  try {

    const isUser = req.user.role === 'user';
    if (!isUser) {
      return res.status(403).json({
        status: 'fail',
        message: 'only user can register',
      });
    }
    const newRegistration = { ...req.body, user_id: req.user.id };
    newRegistration.status = 'pending';


    const createdRegistration = await createRegistrationModel(newRegistration);

    res.status(201).json({
      status: 'success',
      data: createdRegistration,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllRegistrations = async (req, res, next) => {
  try {

    const isAdmin = req.user.role === 'admin';
    if (!isAdmin) {
      return res.status(403).json({
        status: 'fail',
        message: 'Only admins can view all registrations',
      });
    }


    const registrations = await getAllRegistrationsModel();


    res.status(200).json({
      status: 'success',
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedRegistration = await updateRegistrationModel(id, req.body);

    res.status(200).json({
      status: 'success',
      data: updatedRegistration,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserRegistrations = async (req, res, next) => {
  try {
   
    const userId = req.user.id;
    
    if (userId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Šios registracijos tau nepriklauso.',
      });
    }
    const registrations = await getUserRegistrationsModel(userId);

    res.status(200).json({
      status: 'success',
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRegistrationDate = async (req, res, next) => {
  try {
    const registrationId = req.params.id;
    const { tour_date_id } = req.body;
    const userId = req.user.id;

    if (req.user.role !== 'user') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only users can update their registration',
      });
    }

    const registration = await getUserRegistrationById(registrationId, userId);
    if (!registration) {
      return res.status(404).json({
        status: 'fail',
        message: 'Registration not found or not yours',
      });
    }

    const tourDateExists = await checkTourDateExists(tour_date_id);
    if (!tourDateExists) {
      return res.status(400).json({
        status: 'fail',
        message: 'Selected tour date does not exist',
      });
    }

    const updated = await updateRegistrationDate(registrationId, tour_date_id);

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserRegistration = async (req, res, next) => {
  try {
    const registration = await getUserRegistrationById(req.params.id, req.user.id);
    if (!registration) {
      return res.status(404).json({
        status: 'fail',
        message: 'Registration not found or not yours',
      });
    }

    res.status(200).json({
      status: 'success',
      data: registration,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserRegistrationDate = async (req, res, next) => {
  try {
    const registrationId = req.params.id;
    const userId = req.user.id;

    const registration = await getUserRegistrationDateModel(registrationId, userId);

    if (!registration) {
      return res.status(404).json({
        status: 'fail',
        message: 'Registracija nerasta arba nepriklauso jums',
      });
    }

    res.status(200).json({
      status: 'success',
      data: registration,
    });
  } catch (err) {
    next(err);
  }
};


exports.cancelUserRegistration = async (req, res, next) => {
  try {
    const registrationId = req.params.id;
    const userId = req.user.id;

    if (req.user.role !== "user") {
      return res.status(403).json({
        status: "fail",
        message: "Tik vartotojai gali atšaukti savo registracijas",
      });
    }

    // Patikriname, ar registracija priklauso vartotojui
    const registration = await getUserRegistrationById(registrationId, userId);
    if (!registration) {
      return res.status(404).json({
        status: "fail",
        message: "Registracija nerasta arba nepriklauso jums",
      });
    }

    // Patikriname, ar registracija yra tinkamoje būsenoje
    if (registration.status !== "pending" && registration.status !== "approved") {
      return res.status(400).json({
        status: "fail",
        message: "Galima atšaukti tik laukiančias arba patvirtintas registracijas",
      });
    }

    // Atnaujiname būseną į cancelled
    const updatedRegistration = await updateRegistrationModel(registrationId, { status: "cancelled" });

    res.status(200).json({
      status: "success",
      data: updatedRegistration,
    });
  } catch (error) {
    next(error);
  }
};
