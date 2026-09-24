const { Paciente, Cita, Doctor } = require('../models');

// GET /api/pacientes
async function listar(req, res) {
  try {
    const pacientes = await Paciente.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json(pacientes);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar pacientes.', error: error.message });
  }
}

// GET /api/pacientes/:id
async function obtener(req, res) {
  try {
    const paciente = await Paciente.findByPk(req.params.id, {
      include: [{ model: Cita, as: 'citas', include: [{ model: Doctor, as: 'doctor' }] }],
    });
    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado.' });
    }
    return res.status(200).json(paciente);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el paciente.', error: error.message });
  }
}

// POST /api/pacientes
async function crear(req, res) {
  try {
    const { nombre, email, telefono, fecha_nacimiento, historial_medico } = req.body;

    const existente = await Paciente.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe un paciente con ese email.' });
    }

    const paciente = await Paciente.create({
      nombre,
      email,
      telefono,
      fecha_nacimiento,
      historial_medico,
    });

    return res.status(201).json(paciente);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear el paciente.', error: error.message });
  }
}

// PUT /api/pacientes/:id
async function actualizar(req, res) {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado.' });
    }

    await paciente.update(req.body);
    return res.status(200).json(paciente);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar el paciente.', error: error.message });
  }
}

// DELETE /api/pacientes/:id
async function eliminar(req, res) {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado.' });
    }

    await paciente.destroy();
    return res.status(200).json({ mensaje: 'Paciente eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar el paciente.', error: error.message });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
