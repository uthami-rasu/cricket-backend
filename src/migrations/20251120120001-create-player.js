"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("players", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      full_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      date_of_birth: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      nationality: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      batting_style_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "player_batting_styles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      bowling_style_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "player_bowling_styles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      position_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "player_positions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      image_url: {
        allowNull: true,
        type: Sequelize.STRING,
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
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("players");
  },
};
