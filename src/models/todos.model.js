const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class TodosModel extends Model {
    static associate(models) {
      TodosModel.belongsTo(models.users, {
        foreignKey: "userId",
        as: "users",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  TodosModel.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 20],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [3, 255],
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "in-progress", "completed"),
        allowNull: true,
        defaultValue: "pending",
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: false,
        defaultValue: "low",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "todos",
    }
  );
  return TodosModel;
};
