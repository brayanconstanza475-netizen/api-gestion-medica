const { body } = require('express-validator');

const registrarValidator = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('email').trim().isEmail().withMessage('Debe ser un email valido.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contrasena debe tener al menos 6 caracteres.'),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Debe ser un email valido.'),
  body('password').notEmpty().withMessage('La contrasena es obligatoria.'),
];

module.exports = { registrarValidator, loginValidator };
