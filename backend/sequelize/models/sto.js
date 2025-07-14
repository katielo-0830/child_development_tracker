'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class STO extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with the Program model
      STO.belongsTo(models.Program, {
        foreignKey: 'programId',
        as: 'program', // Alias for the association
      });
    }
  }

  STO.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      programId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Programs', // Name of the target table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: DataTypes.ENUM('in_progress', 'mastered', 'pending'),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      masteredDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      trialStructure: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'STO',
    }
  );

  return STO;
};