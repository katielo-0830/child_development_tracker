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
    static associate(models) {
      // define association here
    }
  }
  Therapist.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Therapist',
  });
  return Therapist;
};