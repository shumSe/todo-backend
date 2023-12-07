module.exports = (sequelize) => {

    const Item_Tag = sequelize.define('Item_Tag',{},{ timestamps: false });

    return Item_Tag
}