const {
  createProcedure,
  filterProcedures,
  updateProcedureModel,
  deleteProcedureModel,
  getProcedureByIdModel,
} = require("../models/procedureModel");

exports.createProcedure = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({
        status: "fail",
        message: "only admin can create a procedure",
      });
    }
    const newProcedure = { ...req.body, user_id: req.user.id };

    const createdProcedure = await createProcedure(newProcedure);

    res.status(201).json({
      status: "success",
      data: createdProcedure,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProcedure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProcedure = await updateProcedureModel(id, req.body);

    res.status(200).json({
      status: "success",
      data: updatedProcedure,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProcedure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProcedure = await deleteProcedureModel(id);

    res.status(200).json({
      status: "success",
      data: deletedProcedure,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllProcedures = async (req, res, next) => {
  try {
    const filter = req.query;
    console.log("Gauti filtrai:", filter);

    const allowedFields = [
      "search",
      "category",
      "date",
      "sort_field",
      "sort_direction",
      "page",
      "limit",
    ];
    for (const key of Object.keys(filter)) {
      if (!allowedFields.includes(key)) {
        return res.status(400).json({
          status: "fail",
          message: `Invalid filter field: '${key}'`,
        });
      }
    }

    const page = Math.max(parseInt(filter.page) || 1, 1);
    const limit = Math.max(parseInt(filter.limit) || 10, 1);

    const { procedures, total } = await filterProcedures({
      ...filter,
      limit,
      page,
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: "success",
      page,
      totalPages,
      results: procedures.length,
      total,
      data: procedures,
    });
  } catch (error) {
    console.error("Klaida getFilteredProcedures:", error);
    next(error);
  }
};

exports.getProcedureById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const procedure = await getProcedureByIdModel(id);

    res.status(200).json({
      status: "success",
      data: procedure,
    });
  } catch (error) {
    next(error);
  }
};
