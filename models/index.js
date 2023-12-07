const dbConfig = require('../configs/dbConfig.js')

const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
    
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected')
})
.catch(err => {
    console.log('error' + err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.todoitems = require('./todoItemModel.js')(sequelize, DataTypes)
db.tags = require('./tagModel.js')(sequelize, DataTypes)
db.item_tag = require('./item_tagModel.js')(sequelize)

db.todoitems.belongsToMany(db.tags, {through: db.item_tag})
db.tags.belongsToMany(db.todoitems, {through: db.item_tag})


db.sequelize.sync({force: false})
.then(() => {
    console.log('re-sync')
})

module.exports = db