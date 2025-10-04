import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Program extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if needed
      // For example, if `currentSTO` references another table:
      // Program.belongsTo(models.SomeOtherTable, { foreignKey: 'currentSTO', as: 'currentSTOReference' });
      Program.hasMany(models.STO, {
        foreignKey: 'programId',
        as: 'stos', // Alias for the association
      });
    }
  }

  Program.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('running', 'pending', 'done'),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'Program',
    }
  );

  return Program;
};