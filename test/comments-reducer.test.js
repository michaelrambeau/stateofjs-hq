const createCommentsReducer = require('../src/aggregation/comments-reducer')

const createComments = comments => ({
  answers: {
    aboutYou: {
      comments: { value: comments }
    }
  },
  meta: {}
})

test('Comments reducer', () => {
  const commentsReducer = createCommentsReducer()
  const initialState = { data: [], count: 0 }
  const state = [
    createComments('My comment '),
    createComments(' '),
    createComments(' Another comment')
  ].reduce(commentsReducer, initialState)
  expect(state).toEqual({ count: 2, data: ['My comment', 'Another comment'] })
})
