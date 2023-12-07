const express = require('express')
const cors = require('cors')

const app = express()

var corOptions = {
    origin: 'http://localhost:3000'
}

console.log(`cors ${corOptions.origin}`)

const db = require('./models')
const TodoItem = db.todoitems

// middleware

app.use(cors(corOptions))

app.options('*', cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// routers 

const router = require('./routes/todoRouter.js')
app.use('/api/todo', router)

// testing
app.get('/', (req, res) => {
    res.json({message: 'hello from api'})
})

// server
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})