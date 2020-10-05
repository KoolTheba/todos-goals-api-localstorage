const API = require('../index')

const fixtures = require('./fixtures')

describe('API interface retro-compatibility', () => {
  const availableFunctions = Object.keys(API)
  const expectedFunctions = [
    'fetchGoals',
    'fetchTodos',
    'saveTodo',
    'saveGoal',
    'deleteGoal',
    'deleteTodo',
    'saveTodoToggle'
  ]
  test('Should keep the same interface', () => {
    expect(availableFunctions.sort()).toEqual(expectedFunctions.sort())
  })

  test.each(expectedFunctions)(
    'API.%s should be a function',
    (functionName) => {
      expect(typeof API[functionName]).toEqual('function')
    }
  )
})

// TODOS API TESTS
describe('API todos', () => {
  const todosList = fixtures.todos

  const resetTodos = () => {
    localStorage.clear()
  }

  const populateTodos = () => {
    todosList.forEach(todo => {
      localStorage.__STORE__[todo.id] = JSON.stringify({
        type: 'todo',
        name: todo.name,
        completed: todo.completed
      })
    })
  }

  beforeEach(() => {
    resetTodos()
    localStorage.setItem.mockClear()
    localStorage.removeItem.mockClear()
  })

  test('should fetch all todos previously persisted', async () => {
    populateTodos()
    const todos = await API.fetchTodos()
    expect(todos).toEqual(todosList)
  })

  test('should fetch all todos and returns an empty array if no todos were previously persisted', async () => {
    const todos = await API.fetchTodos()
    expect(todos).toEqual([])
  })

  test('should save todo correctly', async () => {
    const name = 'Walk daily'
    const savedTodo = await API.saveTodo(name)
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(savedTodo).toEqual({ id: fixtures.newItemId, name: 'Walk daily', completed: false })
    expect(Object.keys(localStorage.__STORE__).length).toBe(1)
  })

  test('should throw an error saving a todo if data is missing', () => {
    const id = null
    return expect(API.saveTodo(id)).rejects.toMatch('Error saving a todo. Name not defined.')
  })

  test('should delete an specific todo correctly', async () => {
    populateTodos()
    const { id } = fixtures.todos[0]
    const todo = await API.deleteTodo(id)
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1)
    expect(todo).toEqual(todosList[0])
  })

  test('should throw an error deleting a todo with an incorrect id', () => {
    const id = null
    return expect(API.deleteTodo(id)).rejects.toMatch('Error deleting a todo. Id is not defined.')
  })

  test('should throw an error deleting a todo that not exists', () => {
    const id = fixtures.uselessId
    return expect(API.deleteTodo(id)).rejects.toMatch('The todo does not exist')
  })

  test('should toggle todo correctly to true', async () => {
    populateTodos()
    const { id } = todosList[0]
    const todo = await API.saveTodoToggle(id)
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(todo).toEqual({ ...todosList[0], completed: true })
  })

  test('should toggle todo correctly to true', async () => {
    populateTodos()
    const { id } = todosList[1]
    const todo = await API.saveTodoToggle(id)
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(todo).toEqual({ ...todosList[1], completed: false })
  })

  test('should throw an error toggling a todo with an incorrect id', () => {
    const id = null
    return expect(API.saveTodoToggle(id)).rejects.toMatch('Error toggling a todo. Id incorrect.')
  })

  test('should throw an error toggling a todo that not exists', () => {
    const id = fixtures.uselessId
    return expect(API.saveTodoToggle(id)).rejects.toMatch('Todo item does not exist')
  })
})

// GOALS API TESTS
describe('API goals', () => {
  const goalsList = fixtures.goals
  const resetGoals = () => {
    localStorage.clear()
  }

  const populateGoals = () => {
    goalsList.forEach(goal => {
      localStorage.__STORE__[goal.id] = JSON.stringify({
        type: 'goal',
        name: goal.name
      })
    })
  }

  beforeEach(() => {
    resetGoals()
  })

  test('should fetch all goals previously persisted', async () => {
    populateGoals()
    const goals = await API.fetchGoals()
    expect(goals).toEqual(goalsList)
  })

  test('should fetch all goals and returns an empty array if no goals were previously persisted', async () => {
    const goals = await API.fetchGoals()
    expect(goals).toEqual([])
  })

  test('should save goal correctly', async () => {
    const id = fixtures.newItemId
    const name = 'bar'
    const savedGoal = await API.saveGoal(name)
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(savedGoal).toEqual({ id, name: 'bar' })
    expect(Object.keys(localStorage.__STORE__).length).toBe(1)
  })

  test('should throw an error saving a goal if data is missing', () => {
    const id = null
    return expect(API.saveGoal(id)).rejects.toMatch('Error saving a goal. Name not defined.')
  })

  test('should delete an specific goal correctly', async () => {
    populateGoals()
    const { id } = fixtures.goals[0]
    const deletedGoal = await API.deleteGoal(id)
    expect(deletedGoal).toEqual(fixtures.goals[0])
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1)
    expect(Object.keys(localStorage.__STORE__).length).toBe(1)
  })

  test('should throw an error deleting a goal with an incorrect id', () => {
    const id = null
    return expect(API.deleteGoal(id)).rejects.toMatch('Error deleting a goal. Id is not defined.')
  })

  test('should throw an error deleting a goal that not exists', () => {
    const id = fixtures.uselessId
    return expect(API.deleteGoal(id)).rejects.toMatch('The goal does not exist')
  })
})
