'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Therapist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // ...existing code...
    static associate(models) {
      Therapist.belongsToMany(models.Session, {
        through: 'SessionTherapists',
        foreignKey: 'therapistId',
        otherKey: 'sessionId'
      });
    }
// ...existing code...
  }
  Therapist.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Therapist',
  });
  return Therapist;
};