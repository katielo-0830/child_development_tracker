'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SessionTherapist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SessionTherapist.belongsTo(models.Session, {
        foreignKey: 'sessionId',
        as: 'session' // Optional alias
      });
      SessionTherapist.belongsTo(models.Therapist, {
        foreignKey: 'therapistId',
        as: 'therapist' // Optional alias
      });
    }
  }
  SessionTherapist.init({
    sessionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Sessions', // Name of the target model
        key: 'id'
      },
      allowNull: false
    },
    therapistId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Therapists', // Name of the target model
        key: 'id'
      },
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SessionTherapist',
    tableName: 'SessionTherapists' // Explicitly define table name if needed
  });
  return SessionTherapist;
};