const isShortListMember = keywords => (count, key) => {
  const found = keywords.find(item => item.text === key)
  return found && found.shortlist
}

// Filter a list of responses to keep only the keywords that belong to the "short list"
function compactWithShortList(input, keywords) {
  return Object.keys(input)
    .filter(key => isShortListMember(keywords)(input[key], key))
    .reduce(
      (acc, val) =>
        Object.assign({}, acc, {
          [val]: input[val]
        }),
      {}
    )
}

// Filter responses at a given `path` (E.g. `other` to filter "other responses")
function compactCategoryAnswers({ answers, path, keywords }) {
  const compacted = compactWithShortList(answers[path], keywords)
  return Object.assign({}, answers, {
    [path]: compacted
  })
}

module.exports = {
  compactWithShortList,
  compactCategoryAnswers
}
