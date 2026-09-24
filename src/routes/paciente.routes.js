const { Router } = require('express');
const controlador = require('../controllers/paciente.controller');
const {
  crearPacienteValidator,
  actualizarPacienteValidator,
  idParamValidator,
} = require('../validators/paciente.validator');
const validar = require('../middlewares/validate.middleware');
const autenticar = require('../middlewares/auth.middleware');

const router = Router();

router.use(autenticar);

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: CRUD de pacientes
 */

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Lista todos los pacientes
 *     tags: [Pacientes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de pacientes }
 *   post:
 *     summary: Crea un nuevo paciente
 *     tags: [Pacientes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email]
 *             properties:
 *               nombre: { type: string, example: "Carlos Lopez" }
 *               email: { type: string, example: "carlos.lopez@correo.com" }
 *               telefono: { type: string, example: "7000-0000" }
 *               fecha_nacimiento: { type: string, format: date, example: "1995-05-10" }
 *               historial_medico: { type: string, example: "Sin antecedentes." }
 *     responses:
 *       201: { description: Paciente creado }
 *       409: { description: Email ya registrado }
 */
router.get('/', controlador.listar);
router.post('/', crearPacienteValidator, validar, controlador.crear);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   get:
 *     summary: Obtiene un paciente por id (incluye sus citas)
 *     tags: [Pacientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Datos del paciente }
 *       404: { description: Paciente no encontrado }
 *   put:
 *     summary: Actualiza un paciente
 *     tags: [Pacientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paciente actualizado }
 *       404: { description: Paciente no encontrado }
 *   delete:
 *     summary: Elimina un paciente
 *     tags: [Pacientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paciente eliminado }
 *       404: { description: Paciente no encontrado }
 */
router.get('/:id', idParamValidator, validar, controlador.obtener);
router.put('/:id', actualizarPacienteValidator, validar, controlador.actualizar);
router.delete('/:id', idParamValidator, validar, controlador.eliminar);

module.exports = router;
