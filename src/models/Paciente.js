const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paciente = sequelize.define(
  'Paciente',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    historial_medico: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'pacientes',
    timestamps: true,
  }
);

module.exports = Paciente;
