"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("teams", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      short_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      logo_url: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      home_city: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      coach_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      home_ground: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      year_founded: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      status_id: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
        references: {
          model: "team_statuses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
      modified_at: {
        allowNull: true,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("teams");
  },
};
