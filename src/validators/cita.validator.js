const { body, param } = require('express-validator');

const ESTADOS_VALIDOS = ['pendiente', 'confirmada', 'cancelada', 'completada'];

const crearCitaValidator = [
  body('paciente_id').isInt().withMessage('paciente_id debe ser numerico.'),
  body('doctor_id').isInt().withMessage('doctor_id debe ser numerico.'),
  body('fecha_cita')
    .isISO8601()
    .withMessage('fecha_cita debe ser una fecha valida (ISO8601).')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('La fecha de la cita no puede ser en el pasado.');
      }
      return true;
    }),
  body('estado').optional().isIn(ESTADOS_VALIDOS).withMessage(`estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`),
  body('notas').optional().isString(),
];

const actualizarCitaValidator = [
  param('id').isInt().withMessage('El id debe ser numerico.'),
  body('paciente_id').optional().isInt().withMessage('paciente_id debe ser numerico.'),
  body('doctor_id').optional().isInt().withMessage('doctor_id debe ser numerico.'),
  body('fecha_cita').optional().isISO8601().withMessage('fecha_cita debe ser una fecha valida (ISO8601).'),
  body('estado').optional().isIn(ESTADOS_VALIDOS).withMessage(`estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`),
  body('notas').optional().isString(),
];

const idParamValidator = [param('id').isInt().withMessage('El id debe ser numerico.')];

module.exports = { crearCitaValidator, actualizarCitaValidator, idParamValidator, ESTADOS_VALIDOS };
