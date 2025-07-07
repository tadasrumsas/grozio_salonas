const { createTour, filterTours, updateTourModel, deleteTourModel, getTourByIdModel } = require('../models/tourModel');


exports.createTour = async (req, res, next) => {
    try {
      
       const isAdmin = req.user.role === 'admin';
    if (!isAdmin) {
      return res.status(403).json({
        status: 'fail',
        message: 'only admin can create a tour',
      });
    }
      const newTour = { ...req.body, user_id: req.user.id };
      
      

      const createdTour = await createTour(newTour);
  
      res.status(201).json({
        status: 'success',
        data: createdTour,
      });
    } catch (error) {
      next(error);
    }
  };

  exports.updateTour = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedTour = await updateTourModel(id, req.body);
  
      res.status(200).json({
        status: 'success',
        data: updatedTour,
      });
    } catch (error) {
      next(error);
    }
  };

  exports.deleteTour = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedTour = await deleteTourModel(id);
  
      res.status(200).json({
        status: 'success',
        data: deletedTour,
      });
    } catch (error) {
      next(error);
    }
  };


  exports.getAllTours = async (req, res, next) => {
  try {
    const filter = req.query;
    console.log('Gauti filtrai:', filter);

    const allowedFields = ['search', 'category', 'date', 'sort_field', 'sort_direction', 'page', 'limit'];
    for (const key of Object.keys(filter)) {
      if (!allowedFields.includes(key)) {
        return res.status(400).json({
          status: 'fail',
          message: `Invalid filter field: '${key}'`,
        });
      }
    }

    const page = Math.max(parseInt(filter.page) || 1, 1);
    const limit = Math.max(parseInt(filter.limit) || 10, 1);

    const { tours, total } = await filterTours({
      ...filter,
      limit,
      page
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: 'success',
      page,
      totalPages,
      results: tours.length,
      total,
      data: tours
    });

  } catch (error) {
    console.error('Klaida getFilteredTours:', error);
    next(error);
  }
};



  exports.getTourById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const tour = await getTourByIdModel(id);
  
      res.status(200).json({
        status: 'success',
        data: tour,
      });
    } catch (error) {
      next(error);
    }
  };