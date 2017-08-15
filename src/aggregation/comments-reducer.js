const debug = require('debug')('reducer')

const cleanComment = comment => (comment ? comment.toString().trim() : '')

const commentsReducer = () => (state, response) => {
  debug('About you', Object.keys(response.answers.aboutYou))
  const comment = cleanComment(response.answers.aboutYou.comments.value)
  const data = comment ? state.data.concat(comment) : state.data
  const count = comment ? state.count + 1 : state.count
  return { count, data }
}

module.exports = commentsReducer
