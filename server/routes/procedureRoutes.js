const express = require("express");
const {
  createProcedure,
  getAllProcedures,
  updateProcedure,
  deleteProcedure,
  getProcedureById,
} = require("../controlers/procedureControler");

const validate = require("../validators/validate");
const { protect, allowAccessTo } = require("../controlers/authControler");
const validateCreateProcedure = require("../validators/createProcedure");

const router = express.Router();

router
  .route("/")

  .post(
    protect,
    allowAccessTo("admin"),
    validateCreateProcedure,
    validate,
    createProcedure
  )
  .get(getAllProcedures);

router
  .route("/:id")
  .patch(protect, allowAccessTo("admin"), updateProcedure)
  .get(protect, allowAccessTo("admin"), getProcedureById)
  .delete(protect, allowAccessTo("admin"), deleteProcedure);

router.route("/procedure/:id").get(getProcedureById);

module.exports = router;
