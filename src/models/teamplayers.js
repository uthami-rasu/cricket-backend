"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TeamPlayer extends Model {
    static associate(models) {
      // Example: TeamPlayer.belongsTo(models.Team)
    }
  }
  TeamPlayer.init(
    {
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      player_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      season_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      squad_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4,
        references: {
          model: "player_designations",
          key: "id",
        },
      },
      jersey_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_by: DataTypes.STRING,
      modified_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TeamPlayer",
      tableName: "team_players",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  TeamPlayer.associate = function (models) {
    TeamPlayer.belongsTo(models.Team, {
      as: "team",
      foreignKey: "team_id",
    });

    TeamPlayer.belongsTo(models.Player, {
      as: "player",
      foreignKey: "player_id",
    });

    TeamPlayer.belongsTo(models.Season, {
      as: "season",
      foreignKey: "season_id",
    });

    TeamPlayer.belongsTo(models.PlayerDesignation, {
      as: "squadRole",
      foreignKey: "squad_role_id",
    });
  };
  return TeamPlayer;
};
