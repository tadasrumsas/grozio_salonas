const express = require("express");
const procedureRouter = require("./routes/procedureRoutes");
const userRouter = require("./routes/userRoutes");
const registrationRouter = require("./routes/registrationRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const adminRouter = require("./routes/adminRoutes");
const AppError = require("./utilities/appError");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/procedures", procedureRouter);
app.use("/api/v1/registrations", registrationRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookmarks", bookmarkRoutes);
app.use("/api/v1/admin", adminRouter);
app.all(/(.*)/, (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
});

app.use(errorHandler);

module.exports = app;
