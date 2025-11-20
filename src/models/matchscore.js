"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MatchScores extends Model {
    static associate(models) {
      // define association here
    }
  }

  MatchScores.init(
    {
      match_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      innings_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      over_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ball_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ball_type: {
        type: DataTypes.ENUM("fair", "wide", "no_ball", "dead"),
        allowNull: false,
        defaultValue: "fair",
      },
      batsman_mp_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bowler_mp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      non_striker_mp_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      runs_off_bat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      extras_type: {
        type: DataTypes.ENUM(
          "none",
          "wide",
          "no_ball",
          "bye",
          "leg_bye",
          "penalty"
        ),
        allowNull: false,
        defaultValue: "none",
      },
      extras_runs: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_wicket: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      wicket_type: {
        type: DataTypes.ENUM(
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
        allowNull: false,
        defaultValue: "none",
      },
      dismissed_batsman_mp_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fielder_mp_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_free_hit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      commentary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      event_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "MatchScores",
      tableName: "match_scores",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  MatchScores.associate = function (models) {
    MatchScores.belongsTo(models.Match, {
      as: "match",
      foreignKey: "match_id",
    });

    MatchScores.belongsTo(models.MatchDetails, {
      as: "innings",
      foreignKey: "innings_id",
    });

    MatchScores.belongsTo(models.MatchPlayers, {
      as: "batsman",
      foreignKey: "batsman_mp_id",
    });

    MatchScores.belongsTo(models.MatchPlayers, {
      as: "bowler",
      foreignKey: "bowler_mp_id",
    });

    MatchScores.belongsTo(models.MatchPlayers, {
      as: "nonStriker",
      foreignKey: "non_striker_mp_id",
    });

    MatchScores.belongsTo(models.MatchPlayers, {
      as: "dismissedBatsman",
      foreignKey: "dismissed_batsman_mp_id",
    });

    MatchScores.belongsTo(models.MatchPlayers, {
      as: "fielder",
      foreignKey: "fielder_mp_id",
    });
  };

  return MatchScores;
};
