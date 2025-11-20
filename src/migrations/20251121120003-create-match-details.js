"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("match_details", {
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
      innings_number: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      batting_team_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "teams",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      bowling_team_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "teams",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      opening_batsman1_mp_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "match_players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      opening_batsman2_mp_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "match_players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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

    await queryInterface.addIndex("match_details", {
      fields: ["match_id", "innings_number"],
      unique: true,
      name: "uk_match_details_match_innings",
    });

    await queryInterface.addIndex("match_details", {
      fields: ["match_id"],
      name: "idx_match_details_match_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "match_details",
      "idx_match_details_match_id"
    );
    await queryInterface.removeIndex(
      "match_details",
      "uk_match_details_match_innings"
    );
    await queryInterface.dropTable("match_details");
  },
};
