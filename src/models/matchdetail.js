"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MatchDetails extends Model {
    static associate(models) {
      // define association here
    }
  }

  MatchDetails.init(
    {
      match_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      innings_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      batting_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bowling_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      opening_batsman1_mp_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      opening_batsman2_mp_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "MatchDetails",
      tableName: "match_details",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  MatchDetails.associate = function (models) {
    MatchDetails.belongsTo(models.Match, {
      as: "match",
      foreignKey: "match_id",
    });

    MatchDetails.belongsTo(models.Team, {
      as: "battingTeam",
      foreignKey: "batting_team_id",
    });

    MatchDetails.belongsTo(models.Team, {
      as: "bowlingTeam",
      foreignKey: "bowling_team_id",
    });

    MatchDetails.belongsTo(models.MatchPlayers, {
      as: "openingBatsman1",
      foreignKey: "opening_batsman1_mp_id",
    });

    MatchDetails.belongsTo(models.MatchPlayers, {
      as: "openingBatsman2",
      foreignKey: "opening_batsman2_mp_id",
    });

    MatchDetails.hasMany(models.MatchScores, {
      as: "deliveries",
      foreignKey: "innings_id",
    });
  };

  return MatchDetails;
};
