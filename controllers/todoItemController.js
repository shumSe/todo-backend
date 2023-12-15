
const Op = require('sequelize')

const db = require('../models')

const TodoItem = db.todoitems
const Tag = db.tags
const Item_Tag = db.item_tag

const addTodoItem = async (req,res) => {
    try {
        let info = {
            title: req.body.title,
            description: req.body.description,
            isCompleted: req.body.isCompleted ? req.body.isCompleted : false,
        }

        let tags = req.body.tags ? req.body.tags : null
        console.log('tags ', {tags})

        console.log('add ', {info})

        const todoItem = await TodoItem.create(info)
        if(tags){
        for(const tagName of tags){
                console.log('tagName ', {tagName})
            
                let tagTitle = tagName['tagTitle']
                tagName['usage'] = 0
                let tagItem = await Tag.findOne({where: { tagTitle: tagTitle }})
                if(!tagItem){
                    tagItem = await Tag.create(tagName)
                    console.log('new tagTitle ')
                }
                console.log('old tagTitle ')
                tagItem.usage += 1
                await tagItem.save()
                await todoItem.addTag(tagItem)
            }
        }
        const result = await TodoItem.findOne({
            where: { id: todoItem.id },
            include: Tag
        });

        res.status(200).send(result)
    } catch (error){
        console.log(error)
        res.status(500).json({ error: 'Server error' + error });
    }
} 

const getAllTodoItems = async (req, res) => {
    try{
    let items = await TodoItem.findAll({
        attributes: ['id', 'title', 'description', 'isCompleted'],
        include:{ 
            model: Tag,
            attributes: ['id','tagTitle'],
            through:{
                attributes:[]
            }
        },
    })

    console.log('all')

    res.status(200).send(items)
    } catch(error){
        console.log(error)
        res.status(500).json({ error: 'Server error' + error });
    }
}

const getOneTodoItem = async (req, res) => {
    try{
    let id = req.params.id
    let item = await TodoItem.findOne({
        where: { id: id }, 
        attributes:[
            'title',
            'description',
            'isCompleted',
        ],
        include:{ 
            model: Tag,
            attributes: ['id','tagTitle'],
            through:{
                attributes:[]
            }
        },
    })
    res.status(200).send(item)
    } catch (error){
        console.log(error)
        res.status(500).json({ error: 'Server error' + error });
    } 
}


const updateTodoItem = async (req, res) => {
    try{
    let id = req.params.id
    
    const todoItem = await TodoItem.update(req.body, {where: { id: id }})

    const item = await TodoItem.findOne({
        where: { id : id},
        include: Tag
    })

    const oldTags = await item.getTags()
    for(const oldtag of oldTags){
        oldtag.usage -= 1
        await oldtag.save()
    }
    const newTags = req.body.tags ? req.body.tags : null
    if(newTags){
        let updatedTags = []
        for(const tagName of newTags){
            let tagTitle = tagName['tagTitle']
            let tagItem = await Tag.findOne({where: { tagTitle: tagTitle }})
            if(!tagItem){
                tagName['usage'] = 0
                tagItem = await Tag.create(tagName)
               
            }
            
            tagItem.usage += 1
            await tagItem.save()
            updatedTags.push(tagItem)
        }
        await item.setTags(updatedTags)
    }

    const result = await TodoItem.findOne({
        where: { id: id },
        attributes:[
            'id',
            'title',
            'description',
            'isCompleted',
        ],
        include:{ 
            model: Tag,
            attributes: ['id','tagTitle'],
            through:{
                attributes:[]
            }
        },
      });

    await Tag.destroy({where: {
        usage: {[Op.lte ] : 10 }
    }})

    res.status(200).send(result)
    } catch (error){
        console.log(error)
        res.status(500).json({ error: 'Server error' + error });
    }
}

const deleteTodoItem = async (req, res) => {
    try{
    let id = req.params.id
    await deleteById(id)

    res.status(200).send('Product is deleted')
    } catch (error){
        console.log(error)
        res.status(500).json({ error: 'Server error' + error });
    }
}

const deleteListItems = async (req, res) => {
    try{
    for(const id of req.body.ids){
        await deleteById(id)
    }

    res.status(200).send('Products is deleted')
    } catch (error){
        console.log(error)
        res.status(500).json({ error: 'Server error' + error });
    }   
}

const deleteById = async(id) => {
    const item = await TodoItem.findOne({
        where: { id : id},
        include: Tag
    })

    const oldTags = await item.getTags()
    for(const oldtag of oldTags){
        console.log(oldtag.usage)
        oldtag.usage -= 1

        await oldtag.save()
    }

    await TodoItem.destroy({where: { id: id }})
    await Tag.destroy({where: {
            usage: {[Op.lte ] : 10 }
        }
    })
}


module.exports = {
    addTodoItem,
    getAllTodoItems,
    getOneTodoItem,
    updateTodoItem,
    deleteTodoItem,
    deleteListItems
}