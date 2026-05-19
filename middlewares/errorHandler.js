const errorHandler = (err, req, res, next) => {

  console.log(err);

  res.status(500).json({
    mensaje: "Error interno del servidor"
  });

};

module.exports = errorHandler;
