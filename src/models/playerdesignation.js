"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlayerDesignation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PlayerDesignation.hasMany(models.TeamPlayer, {
        as: "teamAssignments",
        foreignKey: "squad_role_id",
      });
    }
  }
  PlayerDesignation.init(
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
    },
    {
      sequelize,
      modelName: "PlayerDesignation",
      tableName: "player_designations",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  return PlayerDesignation;
};
