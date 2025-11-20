"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("match_players", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      match_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "matches",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      team_player_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "team_players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      is_playing_xi: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      is_substitute: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      batting_position: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      is_captain: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      is_wicket_keeper: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: true,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("match_players", {
      fields: ["match_id", "team_player_id"],
      type: "unique",
      name: "uk_match_players_match_team_player",
    });

    await queryInterface.addIndex("match_players", {
      fields: ["match_id"],
      name: "idx_match_players_match_id",
    });

    await queryInterface.addIndex("match_players", {
      fields: ["team_player_id"],
      name: "idx_match_players_team_player_id",
    });

    await queryInterface.addIndex("match_players", {
      fields: ["batting_position"],
      name: "idx_match_players_batting_position",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "match_players",
      "idx_match_players_batting_position"
    );
    await queryInterface.removeIndex(
      "match_players",
      "idx_match_players_team_player_id"
    );
    await queryInterface.removeIndex(
      "match_players",
      "idx_match_players_match_id"
    );
    await queryInterface.removeConstraint(
      "match_players",
      "uk_match_players_match_team_player"
    );
    await queryInterface.dropTable("match_players");
  },
};
