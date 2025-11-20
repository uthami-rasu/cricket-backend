"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlayerBowlingType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Future association with analytics or other features
    }
  }
  PlayerBowlingType.init(
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
      modelName: "PlayerBowlingType",
      tableName: "player_bowling_types",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  return PlayerBowlingType;
};
