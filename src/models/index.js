const sequelize = require('../config/database');
const User = require('./User');
const Paciente = require('./Paciente');
const Doctor = require('./Doctor');
const Cita = require('./Cita');

// Paciente -> Citas (uno a muchos)
Paciente.hasMany(Cita, { foreignKey: 'paciente_id', as: 'citas', onDelete: 'CASCADE' });
Cita.belongsTo(Paciente, { foreignKey: 'paciente_id', as: 'paciente' });

// Doctor -> Citas (uno a muchos)
Doctor.hasMany(Cita, { foreignKey: 'doctor_id', as: 'citas', onDelete: 'CASCADE' });
Cita.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

module.exports = {
  sequelize,
  User,
  Paciente,
  Doctor,
  Cita,
};
