'use strict';

const { match_status } = require('../utils/constants');

const { values: matchStatusValues, SCHEDULED } = match_status;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seasons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      year: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      start_date: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      end_date: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      status: {
        allowNull: false,
        defaultValue: SCHEDULED,
        type: Sequelize.ENUM(...matchStatusValues),
      },
      created_by: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      modified_by: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE,
      },
      modified_at: {
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('seasons');
  },
};
