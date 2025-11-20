"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MatchStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MatchStatus.hasMany(models.Season, {
        as: "seasons",
        foreignKey: "status_id",
      });
      MatchStatus.hasMany(models.Match, {
        as: "matches",
        foreignKey: "status_id",
      });
    }
  }
  MatchStatus.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      sort_order: DataTypes.INTEGER,
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "MatchStatus",
      tableName: "match_statuses",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  return MatchStatus;
};
