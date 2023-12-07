const todoController = require('../controllers/todoItemController.js') 

const router = require('express').Router()

router.post('/addTodoItem', todoController.addTodoItem)

router.get('/allTodoItems', todoController.getAllTodoItems)

router.delete('/items', todoController.deleteListItems)

router.get('/:id', todoController.getOneTodoItem)

router.put('/:id', todoController.updateTodoItem)

router.delete('/:id', todoController.deleteTodoItem)



module.exports = router