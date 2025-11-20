"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("matches", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      season_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "seasons",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      home_team_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "teams",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      away_team_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "teams",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      venue: {
        allowNull: true,
        type: Sequelize.STRING(150),
      },
      match_date: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      match_time: {
        allowNull: true,
        type: Sequelize.DATE,
        comment: "Stored as UTC datetime; convert to local time in app layer.",
      },
      status_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "match_statuses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      toss_winner_team_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "teams",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      toss_decision: {
        allowNull: true,
        type: Sequelize.ENUM("bat", "field"),
      },
      created_by: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      modified_by: {
        allowNull: true,
        type: Sequelize.STRING(50),
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

    await queryInterface.addIndex("matches", {
      fields: ["season_id"],
      name: "idx_matches_season_id",
    });

    await queryInterface.addIndex("matches", {
      fields: ["match_date"],
      name: "idx_matches_match_date",
    });

    await queryInterface.addIndex("matches", {
      fields: ["status_id"],
      name: "idx_matches_status_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("matches", "idx_matches_status_id");
    await queryInterface.removeIndex("matches", "idx_matches_match_date");
    await queryInterface.removeIndex("matches", "idx_matches_season_id");
    await queryInterface.dropTable("matches");
  },
};
