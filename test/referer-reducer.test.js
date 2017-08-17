const createRefererReducer = require('../src/aggregation/referer-reducer')

const createReferer = referer => ({
  meta: {
    referer
  },
  answers: {}
})

test('Referer reducer', () => {
  const refererReducer = createRefererReducer()
  const initialState = { count: 0, data: {} }
  const state = [
    createReferer('Twitter '),
    createReferer('twitter '),
    createReferer('bestofjs '),
    createReferer('https://t.co/WCILY6Ni6R?xyz')
  ].reduce(refererReducer, initialState)
  expect(state).toEqual({
    count: 3,
    data: { twitter: 2, bestofjs: 1, 't.co/wcily6ni6r': 1 }
  })
})
