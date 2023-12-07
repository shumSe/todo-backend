module.exports = (sequelize, DataTypes) => {

    const Tag = sequelize.define("tag",
    {
      tagTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usage:{
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },)

    return Tag
}