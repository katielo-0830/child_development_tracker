'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SessionTherapists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sessionId: {
        type: Sequelize.INTEGER,
        allowNull: false, // Important for foreign keys
        references: {
          model: 'Sessions', // Name of the target table
          key: 'id'
        },
        onUpdate: 'CASCADE', // Optional: Define action on update
        onDelete: 'CASCADE'  // Optional: Define action on delete (CASCADE will delete join record if session is deleted)
      },
      therapistId: {
        type: Sequelize.INTEGER,
        allowNull: false, // Important for foreign keys
        references: {
          model: 'Therapists', // Name of the target table
          key: 'id'
        },
        onUpdate: 'CASCADE', // Optional: Define action on update
        onDelete: 'CASCADE'  // Optional: Define action on delete (CASCADE will delete join record if therapist is deleted)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // Optional: Add a unique constraint for the combination of sessionId and therapistId
    // if a therapist can only be linked to a session once.
    await queryInterface.addConstraint('SessionTherapists', {
      fields: ['sessionId', 'therapistId'],
      type: 'unique',
      name: 'unique_session_therapist_constraint' // It's good to name your constraints
    });
  },
  async down(queryInterface, Sequelize) {
    // If you added a constraint, you should remove it in the down migration first
    await queryInterface.removeConstraint('SessionTherapists', 'unique_session_therapist_constraint');
    await queryInterface.dropTable('SessionTherapists');
  }
};