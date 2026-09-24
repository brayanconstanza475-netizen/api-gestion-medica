const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cita = sequelize.define(
  'Cita',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_cita: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterNow(value) {
          // Regla de negocio: no se pueden agendar citas en el pasado al crearlas
          if (this.isNewRecord && new Date(value) < new Date()) {
            throw new Error('La fecha de la cita no puede ser en el pasado');
          }
        },
      },
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'citas',
    timestamps: true,
  }
);

module.exports = Cita;
