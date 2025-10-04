import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Trail extends Model {
    static associate(models) {
      // Define associations here
      Trail.belongsTo(models.STO, {
        foreignKey: 'stoId',
        as: 'sto',
        onDelete: 'CASCADE'
      });
      
      Trail.belongsTo(models.Session, {
        foreignKey: 'sessionId',
        as: 'session',
        onDelete: 'CASCADE'
      });
    }
  }
  
  Trail.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    stoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'STOs',
        key: 'id'
      }
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sessions',
        key: 'id'
      }
    },
    response: {
      type: DataTypes.JSON,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Trail',
    tableName: 'Trails',
    timestamps: true
  });
  
  return Trail;
};
