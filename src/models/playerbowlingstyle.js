"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlayerBowlingStyle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PlayerBowlingStyle.hasMany(models.Player, {
        as: "players",
        foreignKey: "bowling_style_id",
      });
    }
  }
  PlayerBowlingStyle.init(
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
      modelName: "PlayerBowlingStyle",
      tableName: "player_bowling_styles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  return PlayerBowlingStyle;
};
