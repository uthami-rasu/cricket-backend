"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate(models) {
      // define association here (e.g., Player.belongsToMany(models.Team, { through: models.TeamPlayer }))
    }
  }
  Player.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      batting_style_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "player_batting_styles",
          key: "id",
        },
      },
      bowling_style_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "player_bowling_styles",
          key: "id",
        },
      },
      position_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "player_positions",
          key: "id",
        },
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_by: DataTypes.STRING,
      modified_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Player",
      tableName: "players",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  Player.associate = function (models) {
    Player.belongsTo(models.PlayerBattingStyle, {
      as: "battingStyle",
      foreignKey: "batting_style_id",
    });

    Player.belongsTo(models.PlayerBowlingStyle, {
      as: "bowlingStyle",
      foreignKey: "bowling_style_id",
    });

    Player.belongsTo(models.PlayerPosition, {
      as: "position",
      foreignKey: "position_id",
    });

    Player.hasMany(models.TeamPlayer, {
      as: "teamAssignments",
      foreignKey: "player_id",
    });

    Player.belongsToMany(models.Team, {
      as: "teams",
      through: models.TeamPlayer,
      foreignKey: "player_id",
      otherKey: "team_id",
    });
  };
  return Player;
};
