const globalError = (error, req, res, next) => {
  const status = error.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

const sendErrorDev = (error, res) => {
  return res.status(error.statusCode ||500).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
};
const sendErrorProd = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

export default globalError;
