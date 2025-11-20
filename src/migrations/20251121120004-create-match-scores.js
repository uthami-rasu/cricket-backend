"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("match_scores", {
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
      innings_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "match_details",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      over_number: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      ball_number: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      ball_type: {
        allowNull: false,
        type: Sequelize.ENUM("fair", "wide", "no_ball", "dead"),
        defaultValue: "fair",
      },
      batsman_mp_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "match_players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      bowler_mp_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "match_players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      non_striker_mp_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "match_players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      runs_off_bat: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      extras_type: {
        allowNull: false,
        type: Sequelize.ENUM(
          "none",
          "wide",
          "no_ball",
          "bye",
          "leg_bye",
          "penalty"
        ),
        defaultValue: "none",
      },
      extras_runs: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_wicket: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      wicket_type: {
        allowNull: false,
        type: Sequelize.ENUM(
          "bowled",
          "caught",
          "lbw",
          "runout",
          "stumped",
          "hit_wicket",
          "retired_hurt",
          "obstructing",
          "none"
        ),
        defaultValue: "none",
      },
      dismissed_batsman_mp_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "match_players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fielder_mp_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "match_players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      is_free_hit: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      commentary: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      event_timestamp: {
        allowNull: true,
        type: Sequelize.DATE,
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

    // Add indexes for better query performance
    await queryInterface.addIndex("match_scores", {
      fields: ["match_id"],
      name: "idx_match_scores_match_id",
    });

    await queryInterface.addIndex("match_scores", {
      fields: ["innings_id"],
      name: "idx_match_scores_innings_id",
    });

    await queryInterface.addIndex("match_scores", {
      fields: ["match_id", "innings_id", "over_number", "ball_number"],
      unique: true,
      name: "uk_match_scores_ball",
    });

    await queryInterface.addIndex("match_scores", {
      fields: ["batsman_mp_id"],
      name: "idx_match_scores_batsman_mp_id",
    });

    await queryInterface.addIndex("match_scores", {
      fields: ["bowler_mp_id"],
      name: "idx_match_scores_bowler_mp_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "match_scores",
      "idx_match_scores_bowler_mp_id"
    );
    await queryInterface.removeIndex(
      "match_scores",
      "idx_match_scores_batsman_mp_id"
    );
    await queryInterface.removeIndex("match_scores", "uk_match_scores_ball");
    await queryInterface.removeIndex(
      "match_scores",
      "idx_match_scores_innings_id"
    );
    await queryInterface.removeIndex(
      "match_scores",
      "idx_match_scores_match_id"
    );
    await queryInterface.dropTable("match_scores");
  },
};
