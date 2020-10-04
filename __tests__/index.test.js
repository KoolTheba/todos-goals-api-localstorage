const API = require('../index')

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
