const { body } = require("express-validator");

const validateCreateProcedure = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 3, max: 40 })
    .withMessage("Title must be between 3 and 40 characters long")
    .matches(/^[\p{L}0-9\s\-',.]+$/u)
    .withMessage(
      "Title can only contain letters (incl. accented), numbers, spaces, hyphens, apostrophes, commas, and periods"
    ),

  body("image")
    .isString()
    .withMessage("Image must be a string")
    .notEmpty()
    .withMessage("Image is required")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Image URL must be between 3 and 200 characters long")
    .isURL()
    .withMessage("Image must be a valid URL"),

  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage("Description must be between 3 and 1000 characters long")
    .matches(/^[\s\S]*$/)
    .withMessage(
      "Description can only contain letters (incl. accented), numbers, spaces, hyphens, apostrophes, commas, and periods"
    ),

  body("location")
    .isString()
    .withMessage("Location must be a string")
    .notEmpty()
    .withMessage("Location is required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Location must be between 3 and 100 characters long")
    .matches(/^[a-zA-Z0-9\s\-',.]+$/)
    .withMessage(
      "Location can only contain letters, numbers, spaces, hyphens, apostrophes, commas, and periods"
    ),

  body("category_name")
    .isString()
    .withMessage("Category name must be a string")
    .notEmpty()
    .withMessage("Category name is required")
    .trim()
    .isIn(["individual", "groups"])
    .withMessage('Category name must be either "individual" or "groups"'),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1, max: 600 })
    .withMessage("Duration must be a whole number between 1 and 600"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0.01, max: 10000 })
    .withMessage("Price must be a number between 0.01 and 10000"),

  body("dates")
    .notEmpty()
    .withMessage("Dates are required")
    .isArray({ min: 1 })
    .withMessage("At least one date is required")
    .custom((dates) => {
      // Tikrina, ar kiekviena data yra validi
      return dates.every((date) => {
        // Patikrina, ar data atitinka formatą (pvz., "2025-06-01 10:00:00" arba ISO 8601)
        const isValidFormat =
          /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date) || // "YYYY-MM-DD HH:mm:ss"
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d{3}Z)?$/.test(date); // ISO 8601
        if (!isValidFormat) {
          throw new Error(
            'Visos datos turi būti validžios (pvz., "2025-06-01 10:00:00" arba "2025-06-01T10:00:00.000Z")'
          );
        }

        // Patikrina, ar data yra validi (pvz., ne "2025-13-01")
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error(`Data "${date}" yra nevalidi`);
        }

        // tikrina, ar data yra ateityje
        const now = new Date();
        if (parsedDate < now) {
          throw new Error(`Data "${date}" negali būti praeityje`);
        }

        return true;
      });
    }),
];

module.exports = validateCreateProcedure;
