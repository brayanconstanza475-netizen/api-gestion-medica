const { Cita, Paciente, Doctor } = require('../models');
const { sequelize } = require('../models');

const incluirRelaciones = [
  { model: Paciente, as: 'paciente', attributes: ['id', 'nombre', 'email'] },
  { model: Doctor, as: 'doctor', attributes: ['id', 'nombre', 'especialidad'] },
];

// GET /api/citas
async function listar(req, res) {
  try {
    const citas = await Cita.findAll({ order: [['fecha_cita', 'ASC']], include: incluirRelaciones });
    return res.status(200).json(citas);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar citas.', error: error.message });
  }
}

// GET /api/citas/:id
async function obtener(req, res) {
  try {
    const cita = await Cita.findByPk(req.params.id, { include: incluirRelaciones });
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada.' });
    }
    return res.status(200).json(cita);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener la cita.', error: error.message });
  }
}

// POST /api/citas
async function crear(req, res) {
  try {
    const { paciente_id, doctor_id, fecha_cita, estado, notas } = req.body;

    const paciente = await Paciente.findByPk(paciente_id);
    if (!paciente) {
      return res.status(404).json({ mensaje: 'El paciente indicado no existe.' });
    }

    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({ mensaje: 'El doctor indicado no existe.' });
    }

    const cita = await Cita.create({ paciente_id, doctor_id, fecha_cita, estado, notas });
    const citaCompleta = await Cita.findByPk(cita.id, { include: incluirRelaciones });

    return res.status(201).json(citaCompleta);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear la cita.', error: error.message });
  }
}

// PUT /api/citas/:id
async function actualizar(req, res) {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada.' });
    }

    if (req.body.paciente_id) {
      const paciente = await Paciente.findByPk(req.body.paciente_id);
      if (!paciente) {
        return res.status(404).json({ mensaje: 'El paciente indicado no existe.' });
      }
    }

    if (req.body.doctor_id) {
      const doctor = await Doctor.findByPk(req.body.doctor_id);
      if (!doctor) {
        return res.status(404).json({ mensaje: 'El doctor indicado no existe.' });
      }
    }

    await cita.update(req.body);
    const citaActualizada = await Cita.findByPk(cita.id, { include: incluirRelaciones });

    return res.status(200).json(citaActualizada);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar la cita.', error: error.message });
  }
}

// DELETE /api/citas/:id
async function eliminar(req, res) {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada.' });
    }

    await cita.destroy();
    return res.status(200).json({ mensaje: 'Cita eliminada correctamente.' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar la cita.', error: error.message });
  }
}

// GET /api/reportes/citas-por-estado
async function reporteCitasPorEstado(req, res) {
  try {
    const resultado = await Cita.findAll({
      attributes: ['estado', [sequelize.fn('COUNT', sequelize.col('id')), 'total']],
      group: ['estado'],
    });
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al generar el reporte.', error: error.message });
  }
}

// GET /api/reportes/citas-por-doctor
async function reporteCitasPorDoctor(req, res) {
  try {
    const resultado = await Doctor.findAll({
      attributes: ['id', 'nombre', 'especialidad', [sequelize.fn('COUNT', sequelize.col('citas.id')), 'total_citas']],
      include: [{ model: Cita, as: 'citas', attributes: [] }],
      group: ['Doctor.id'],
    });
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al generar el reporte.', error: error.message });
  }
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
  reporteCitasPorEstado,
  reporteCitasPorDoctor,
};
