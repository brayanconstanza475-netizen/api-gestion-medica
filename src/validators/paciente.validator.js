const { body, param } = require('express-validator');

const crearPacienteValidator = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('email').trim().isEmail().withMessage('Debe ser un email valido.'),
  body('telefono').optional().isString(),
  body('fecha_nacimiento')
    .optional()
    .isISO8601()
    .withMessage('La fecha de nacimiento debe tener formato YYYY-MM-DD.'),
  body('historial_medico').optional().isString(),
];

const actualizarPacienteValidator = [
  param('id').isInt().withMessage('El id debe ser numerico.'),
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacio.'),
  body('email').optional().trim().isEmail().withMessage('Debe ser un email valido.'),
  body('telefono').optional().isString(),
  body('fecha_nacimiento')
    .optional()
    .isISO8601()
    .withMessage('La fecha de nacimiento debe tener formato YYYY-MM-DD.'),
  body('historial_medico').optional().isString(),
];

const idParamValidator = [param('id').isInt().withMessage('El id debe ser numerico.')];

module.exports = { crearPacienteValidator, actualizarPacienteValidator, idParamValidator };
