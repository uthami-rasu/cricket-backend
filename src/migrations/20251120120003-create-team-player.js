"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("team_players", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      team_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "teams",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      player_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      season_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "seasons",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      squad_role_id: {
        allowNull: false,
        defaultValue: 4,
        type: Sequelize.INTEGER,
        references: {
          model: "player_designations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      jersey_number: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      is_active: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
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

    await queryInterface.addConstraint("team_players", {
      fields: ["team_id", "player_id", "season_id"],
      type: "unique",
      name: "uq_team_players_assignment",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("team_players");
  },
};
