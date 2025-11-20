"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("player_bowling_styles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      label: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      sort_order: {
        type: Sequelize.INTEGER,
      },
      is_active: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
      created_by: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      modified_at: {
        allowNull: true,
        defaultValue: Sequelize.literal("NULL ON UPDATE CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
      modified_by: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("player_bowling_styles");
  },
};
