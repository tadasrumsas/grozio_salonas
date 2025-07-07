const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errStatus = err.status || 'error';
    const errMessage = err.message || 'Internel Server Error';
   console.log(statusCode, errStatus, errMessage);
   
    res.status(statusCode).json({
      status: errStatus,
      message: errMessage,
    });
  };
   
  module.exports = errorHandler;