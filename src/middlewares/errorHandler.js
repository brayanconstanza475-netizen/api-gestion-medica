/* eslint-disable no-unused-vars */

/**
 * Middleware de manejo de errores centralizado.
 * Cualquier error que llegue aqui (por ejemplo lanzado en un controlador
 * sin try/catch) se responde de forma consistente en JSON.
 */
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    mensaje: err.message || 'Error interno del servidor.',
  });
}

module.exports = errorHandler;
