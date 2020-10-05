const { v4: uuidv4 } = require('uuid')

const API = {}

API.fetchGoals = () => {
  return new Promise((resolve, reject) => {
    const goals = Object.keys(localStorage)
      .filter(key => localStorage[key].type === 'goal')
      .map(key => {
        return {
          id: key,
          name: localStorage[key].name
        }
      })
    resolve(goals)
  })
}

API.fetchTodos = () => {
  return new Promise((resolve, reject) => {
    const todos = Object.keys(localStorage)
      .filter(key => localStorage[key].type === 'todo')
      .map(key => {
        return {
          id: key,
          name: localStorage[key].name,
          completed: localStorage[key].completed
        }
      })
    resolve(todos)
  })
}

API.saveGoal = (name) => {
  return new Promise((resolve, reject) => {
    if (!name) reject('Error saving goal. Name not defined.')

    const goal = {
      type: 'goal',
      name
    }

    const id = uuidv4()
    localStorage.setItem(id, goal)
    resolve({ name: goal.name, id })
  })
}

API.saveTodo = (name) => {
  return new Promise((resolve, reject) => {
    if (!name) reject('Error saving a todo. Name incorrect.')

    const todo = {
      type: 'todo',
      name,
      completed: false
    }
    const id = uuidv4()
    localStorage.setItem(id, todo)
    resolve({ name: todo.name, completed: todo.completed, id })
  })
}

API.deleteGoal = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) return reject('Error deleting a goal. Id is not defined.')

    const goal = localStorage.getItem(id)
    if (!goal) return reject('The goal does not exist')

    localStorage.removeItem(id)
    resolve({ id, name: goal.name })
  })
}

API.deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) return reject('Error deleting a todo. Id incorrect.')

    const todo = localStorage.getItem(id)
    if (!todo) return reject('Todo item does not exist')

    localStorage.removeItem(id)
    resolve({ id, name: todo.name, completed: todo.completed })
  })
}

API.saveTodoToggle = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) return reject('Error toggling a todo. Id incorrect.')

    const todo = localStorage.getItem(id)
    if (!todo) return reject('Todo item does not exist')

    localStorage.setItem(id, { completed: !todo.completed })
    resolve({ id, name: todo.name, completed: !todo.completed })
  })
}

module.exports = API
