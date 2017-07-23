// Return the array of available values for a given question
function getQuestionOptions(question, types) {
  const { options, type } = question
  return options || types[type]
}

module.exports = getQuestionOptions
