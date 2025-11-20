"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here (e.g., Team.hasMany(models.TeamPlayer))
    }
  }
  Team.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      short_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      home_city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      coach_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      home_ground: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      year_founded: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
          model: "team_statuses",
          key: "id",
        },
      },
      created_by: DataTypes.STRING,
      modified_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Team",
      tableName: "teams",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  Team.associate = function (models) {
    Team.belongsTo(models.TeamStatus, {
      as: "status",
      foreignKey: "status_id",
    });

    Team.hasMany(models.TeamPlayer, {
      as: "teamPlayers",
      foreignKey: "team_id",
    });

    Team.belongsToMany(models.Player, {
      as: "players",
      through: models.TeamPlayer,
      foreignKey: "team_id",
      otherKey: "player_id",
    });
  };
  return Team;
};
