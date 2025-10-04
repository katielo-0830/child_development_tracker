import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Session.belongsToMany(models.Therapist, {
        through: 'SessionTherapists',
        foreignKey: 'sessionId',
        otherKey: 'therapistId',
        as: 'therapists' // Change alias to lowercase "therapists"
      });
    }
  }
  Session.init({
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    notes: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};