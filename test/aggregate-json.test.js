// const debug = require('debug')('agg')

const getInitialState = require('../src/aggregation/initial-state')
const counterReducer = require('../src/aggregation/reducer')

test('Default state', () => {
  const state = getInitialState()
  expect(Object.keys(state)).toEqual(['meta', 'answers'])
  expect(state.meta.browser).toEqual({})
  expect(state.answers.frontend.react).toEqual([0, 0, 0, 0, 0])
  expect(state.answers.backend.sails).toEqual([0, 0, 0, 0, 0])
  expect(state.answers.otherTools['package-managers']).toEqual({
    options: [0, 0, 0, 0],
    other: {}
  })
})

test('Meta reducer', () => {
  const initialState = getInitialState()
  const answers = [
    {
      meta: {
        location: 'Osaka',
        browser: 'Chrome'
      },
      answers: {}
    },
    {
      meta: {
        location: 'Toulouse',
        browser: 'Chrome'
      },
      answers: {}
    }
  ]
  const state = answers.reduce(counterReducer, initialState)
  expect(Object.keys(state)).toEqual(['meta', 'answers'])
  expect(state.meta.location).toEqual({ Osaka: 1, Toulouse: 1 })
  expect(state.meta.browser).toEqual({ Chrome: 2 })
  const updatedState = [{ meta: { location: 'Osaka' } }].reduce(
    counterReducer,
    state
  )
  expect(updatedState.meta.location).toEqual({ Osaka: 2, Toulouse: 1 })
})

const likeReact = {
  answers: {
    frontend: {
      react: {
        value: 3,
        type: 'knowledge'
      }
    }
  },
  meta: {}
}

const noMoreAngular = {
  answers: {
    frontend: {
      'angular-1': {
        value: 4,
        type: 'knowledge'
      }
    }
  },
  meta: {}
}

test('Answers reducer - Frontend questions', () => {
  const initialState = getInitialState()
  const data = [likeReact, likeReact]
  const state = data.reduce(counterReducer, initialState)
  expect(state.answers.frontend['angular-1']).toEqual([0, 0, 0, 0, 0])
  expect(state.answers.frontend.react).toEqual([0, 0, 0, 2, 0])
  const nextState = [noMoreAngular].reduce(counterReducer, state)
  expect(nextState.answers.frontend.react).toEqual([0, 0, 0, 2, 0])
  expect(nextState.answers.frontend['angular-1']).toEqual([0, 0, 0, 0, 1])
})

const multichoiceAnswer = value => ({
  answers: {
    otherTools: {
      'package-managers': { value, type: 'multi' }
    }
  },
  meta: {}
})

test('Answers reducer - Multichoice 1 - only 1 value selected', () => {
  const initialState = getInitialState()
  const data = [multichoiceAnswer(0)]
  const state = data.reduce(counterReducer, initialState)
  expect(state.answers.frontend.react).toEqual([0, 0, 0, 0, 0])
  expect(state.answers.otherTools['package-managers'].options).toEqual([
    1,
    0,
    0,
    0
  ])
})

test('Answers reducer - Multichoice - 2 values selected', () => {
  const initialState = getInitialState()
  const data = [multichoiceAnswer([0, 1])]
  const state = data.reduce(counterReducer, initialState)
  expect(state.answers.frontend.react).toEqual([0, 0, 0, 0, 0])
  expect(state.answers.otherTools['package-managers'].options).toEqual([
    1,
    1,
    0,
    0
  ])
})

test('Answers reducer - Multichoice - 2 values selected and a custom choice', () => {
  const initialState = getInitialState()
  const data = [multichoiceAnswer([0, 1, 'PNPM'])]
  const state = data.reduce(counterReducer, initialState)
  expect(state.answers.frontend.react).toEqual([0, 0, 0, 0, 0])
  expect(state.answers.otherTools['package-managers']).toEqual({
    options: [1, 1, 0, 0],
    other: {
      PNPM: 1
    }
  })
})

const opinionAnswer = value => ({
  answers: {
    opinion: {
      'too-long': { value, type: 'single' }
    }
  },
  meta: {}
})

test('Answers reducer - Opinion', () => {
  const initialState = getInitialState()
  const data = [opinionAnswer(4), opinionAnswer(1), opinionAnswer(4)]
  const state = data.reduce(counterReducer, initialState)
  expect(state.answers.opinion['too-long']).toEqual([0, 1, 0, 0, 2])
})

const ideAnswer = value => ({
  answers: {
    otherTools: {
      ide: { value, type: 'single' }
    }
  },
  meta: {}
})

test('Answers reducer - Favorite IDE', () => {
  const initialState = getInitialState()
  const data = [ideAnswer('PyCharm')]
  const state = data.reduce(counterReducer, initialState)
  expect(state.answers.otherTools['ide'].other).toEqual({ PyCharm: 1 })
})

const fromAnswer = value => ({
  answers: {
    aboutYou: {
      from: { value, type: 'text' }
    }
  },
  meta: {}
})

test('Answers reducer - About you - From', () => {
  const initialState = getInitialState()
  const data = [fromAnswer('Twitter')]
  const state = data.reduce(counterReducer, initialState)
  expect(state.answers.aboutYou.from).toEqual({ Twitter: 1 })
})
