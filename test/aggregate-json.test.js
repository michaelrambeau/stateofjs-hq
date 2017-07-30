const fs = require('fs-extra')
const path = require('path')
const csv = require('csv')
const times = require('lodash.times')
const { promisify } = require('util')
const parse = promisify(csv.parse)
const pReduce = require('p-reduce')
const debug = require('debug')('agg')
// const aggregate = require('../src/aggregate')
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
    frontend: [
      {
        category: 'frontend',
        key: 'react',
        text: 'React',
        value: 3
      }
    ]
  },
  meta: {}
}

const noMoreAngular = {
  answers: {
    frontend: [
      {
        category: 'frontend',
        key: 'angular-1',
        value: 4
      }
    ]
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
    otherTools: [
      {
        category: 'otherTools',
        key: 'package-managers',
        type: 'multi',
        value
      }
    ]
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
    opinion: [
      {
        category: 'opinion',
        key: 'too-long',
        type: 'opinion',
        value
      }
    ]
  },
  meta: {}
})

test('Answers reducer - Opinion', () => {
  const initialState = getInitialState()
  const data = [opinionAnswer(4), opinionAnswer(1), opinionAnswer(4)]
  const state = data.reduce(counterReducer, initialState)
  expect(state.answers.opinion['too-long']).toEqual([0, 1, 0, 0, 2])
})
