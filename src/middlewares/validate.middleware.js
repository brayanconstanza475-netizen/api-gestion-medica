const { validationResult } = require('express-validator');

/**
 * Revisa si las reglas de express-validator definidas en la ruta
 * encontraron errores. Si los hay, corta la peticion con un 422.
 */
function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({
      mensaje: 'Error de validacion.',
      errores: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
}

module.exports = validar;
