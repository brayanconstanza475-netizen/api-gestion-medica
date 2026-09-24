const { body, param } = require('express-validator');

const crearDoctorValidator = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('email').trim().isEmail().withMessage('Debe ser un email valido.'),
  body('especialidad').trim().notEmpty().withMessage('La especialidad es obligatoria.'),
  body('telefono').optional().isString(),
  body('cualificaciones').optional().isString(),
];

const actualizarDoctorValidator = [
  param('id').isInt().withMessage('El id debe ser numerico.'),
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacio.'),
  body('email').optional().trim().isEmail().withMessage('Debe ser un email valido.'),
  body('especialidad').optional().trim().notEmpty(),
  body('telefono').optional().isString(),
  body('cualificaciones').optional().isString(),
];

const idParamValidator = [param('id').isInt().withMessage('El id debe ser numerico.')];

module.exports = { crearDoctorValidator, actualizarDoctorValidator, idParamValidator };
