const { v4: uuidv4 } = require('uuid')

const API = {}

const fetchAllItemsbyType = (type) => {
  return Promise.resolve(Object.keys(localStorage)
    .filter(key => JSON.parse(localStorage[key]).type === type)
    .map(key => {
      const { type, ...data } = JSON.parse(localStorage[key])
      return {
        id: key,
        ...data
      }
    }))
}

const saveItemByType = (type) => (name) => {
  return new Promise((resolve, reject) => {
    if (!name) reject(`Error saving a ${type}. Name not defined.`)

    const item = {
      type,
      name
    }

    if (type === 'todo') item.completed = false

    const id = uuidv4()
    localStorage.setItem(id, JSON.stringify(item))
    const { type: storedType, ...data } = item

    resolve({ ...data, id })
  })
}

const deleteItemByType = (type) => (id) => {
  return new Promise((resolve, reject) => {
    if (!id) return reject(`Error deleting a ${type}. Id is not defined.`)

    const item = localStorage.getItem(id)
    if (!item) return reject(`The ${type} does not exist`)

    localStorage.removeItem(id)

    const { type: storedType, ...data } = JSON.parse(item)
    resolve({ ...data, id })
  })
}

API.fetchGoals = () => fetchAllItemsbyType('goal')
API.fetchTodos = () => fetchAllItemsbyType('todo')
API.saveTodo = saveItemByType('todo')
API.saveGoal = saveItemByType('goal')
API.deleteTodo = deleteItemByType('todo')
API.deleteGoal = deleteItemByType('goal')
API.saveTodoToggle = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) return reject('Error toggling a todo. Id incorrect.')

    const todo = JSON.parse(localStorage.getItem(id))
    if (!todo) return reject('Todo item does not exist')

    localStorage.setItem(id, JSON.stringify({ ...todo, completed: !todo.completed }))
    resolve({ id, name: todo.name, completed: !todo.completed })
  })
}

module.exports = API
