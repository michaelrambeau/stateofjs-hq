const groupAnswers = require('./group-answers')

test('It should group options that belong to the same question', () => {
  const input = {
    list_55680622_choice_69899414: 'NPM',
    list_55680622_choice_69899415: 'Yarn',
    list_55677344_choice_69896647: 'jQuery',
    list_Gwo0_choice: 'Sublime Text'
  }
  const expected = {
    list_55680622: ['NPM', 'Yarn'],
    list_55677344: 'jQuery',
    list_Gwo0: 'Sublime Text'
  }
  const groupedAnswers = groupAnswers(input)
  expect(groupedAnswers).toEqual(expected)
})
