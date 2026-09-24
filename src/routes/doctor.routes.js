const { Router } = require('express');
const controlador = require('../controllers/doctor.controller');
const {
  crearDoctorValidator,
  actualizarDoctorValidator,
  idParamValidator,
} = require('../validators/doctor.validator');
const validar = require('../middlewares/validate.middleware');
const autenticar = require('../middlewares/auth.middleware');

const router = Router();

router.use(autenticar);

/**
 * @swagger
 * tags:
 *   name: Doctores
 *   description: CRUD de doctores
 */

/**
 * @swagger
 * /api/doctores:
 *   get:
 *     summary: Lista todos los doctores
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de doctores }
 *   post:
 *     summary: Crea un nuevo doctor
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, especialidad]
 *             properties:
 *               nombre: { type: string, example: "Dra. Maria Gomez" }
 *               email: { type: string, example: "maria.gomez@correo.com" }
 *               especialidad: { type: string, example: "Pediatria" }
 *               telefono: { type: string, example: "7222-2222" }
 *               cualificaciones: { type: string }
 *     responses:
 *       201: { description: Doctor creado }
 *       409: { description: Email ya registrado }
 */
router.get('/', controlador.listar);
router.post('/', crearDoctorValidator, validar, controlador.crear);

/**
 * @swagger
 * /api/doctores/{id}:
 *   get:
 *     summary: Obtiene un doctor por id (incluye sus citas)
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Datos del doctor }
 *       404: { description: Doctor no encontrado }
 *   put:
 *     summary: Actualiza un doctor
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Doctor actualizado }
 *       404: { description: Doctor no encontrado }
 *   delete:
 *     summary: Elimina un doctor
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Doctor eliminado }
 *       404: { description: Doctor no encontrado }
 */
router.get('/:id', idParamValidator, validar, controlador.obtener);
router.put('/:id', actualizarDoctorValidator, validar, controlador.actualizar);
router.delete('/:id', idParamValidator, validar, controlador.eliminar);

module.exports = router;
