"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MatchPlayers extends Model {
    static associate(models) {
      // define association here
    }
  }

  MatchPlayers.init(
    {
      match_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      team_player_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_playing_xi: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_substitute: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      batting_position: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_captain: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_wicket_keeper: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "MatchPlayers",
      tableName: "match_players",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  MatchPlayers.associate = function (models) {
    MatchPlayers.belongsTo(models.Match, {
      as: "match",
      foreignKey: "match_id",
    });

    MatchPlayers.belongsTo(models.TeamPlayer, {
      as: "teamPlayer",
      foreignKey: "team_player_id",
    });

    MatchPlayers.hasMany(models.MatchScores, {
      as: "battingDeliveries",
      foreignKey: "batsman_mp_id",
    });

    MatchPlayers.hasMany(models.MatchScores, {
      as: "bowlingDeliveries",
      foreignKey: "bowler_mp_id",
    });

    MatchPlayers.hasMany(models.MatchScores, {
      as: "fieldingDismissals",
      foreignKey: "fielder_mp_id",
    });
  };

  return MatchPlayers;
};
