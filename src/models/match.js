"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    static associate(models) {
      // define association here
    }
  }

  Match.init(
    {
      season_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      home_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      away_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      venue: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      match_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      match_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      toss_winner_team_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      toss_decision: {
        type: DataTypes.ENUM("bat", "field"),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      modified_by: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Match",
      tableName: "matches",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Match.associate = function (models) {
    Match.belongsTo(models.Season, {
      as: "season",
      foreignKey: "season_id",
    });

    Match.belongsTo(models.Team, {
      as: "homeTeam",
      foreignKey: "home_team_id",
    });

    Match.belongsTo(models.Team, {
      as: "awayTeam",
      foreignKey: "away_team_id",
    });

    Match.belongsTo(models.Team, {
      as: "tossWinner",
      foreignKey: "toss_winner_team_id",
    });

    Match.belongsTo(models.MatchStatus, {
      as: "status",
      foreignKey: "status_id",
    });

    Match.hasMany(models.MatchDetails, {
      as: "innings",
      foreignKey: "match_id",
    });

    Match.hasMany(models.MatchPlayers, {
      as: "matchPlayers",
      foreignKey: "match_id",
    });

    Match.hasMany(models.MatchScores, {
      as: "deliveries",
      foreignKey: "match_id",
    });
  };

  return Match;
};
