module.exports = (sequelize, DataTypes) => {

    const TodoItem = sequelize.define("todoitem",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },)

    return TodoItem
}