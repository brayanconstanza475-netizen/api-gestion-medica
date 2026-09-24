const { Doctor, Cita, Paciente } = require('../models');

// GET /api/doctores
async function listar(req, res) {
  try {
    const doctores = await Doctor.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json(doctores);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar doctores.', error: error.message });
  }
}

// GET /api/doctores/:id
async function obtener(req, res) {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [{ model: Cita, as: 'citas', include: [{ model: Paciente, as: 'paciente' }] }],
    });
    if (!doctor) {
      return res.status(404).json({ mensaje: 'Doctor no encontrado.' });
    }
    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el doctor.', error: error.message });
  }
}

// POST /api/doctores
async function crear(req, res) {
  try {
    const { nombre, email, especialidad, telefono, cualificaciones } = req.body;

    const existente = await Doctor.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe un doctor con ese email.' });
    }

    const doctor = await Doctor.create({ nombre, email, especialidad, telefono, cualificaciones });

    return res.status(201).json(doctor);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear el doctor.', error: error.message });
  }
}

// PUT /api/doctores/:id
async function actualizar(req, res) {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ mensaje: 'Doctor no encontrado.' });
    }

    await doctor.update(req.body);
    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar el doctor.', error: error.message });
  }
}

// DELETE /api/doctores/:id
async function eliminar(req, res) {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ mensaje: 'Doctor no encontrado.' });
    }

    await doctor.destroy();
    return res.status(200).json({ mensaje: 'Doctor eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar el doctor.', error: error.message });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
