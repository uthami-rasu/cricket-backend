"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Season extends Model {
    static associate(models) {
      // define association here (e.g., Season.hasMany(models.Match))
    }
  }
  Season.init(
    {
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
        references: {
          model: "match_statuses",
          key: "id",
        },
      },
      created_by: DataTypes.STRING,
      modified_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Season",
      tableName: "seasons",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  Season.associate = function (models) {
    Season.belongsTo(models.MatchStatus, {
      as: "status",
      foreignKey: "status_id",
    });

    Season.hasMany(models.TeamPlayer, {
      as: "teamAssignments",
      foreignKey: "season_id",
    });

    // Future: Season.hasMany(models.Match)
  };
  return Season;
};
