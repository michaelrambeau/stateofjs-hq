const sortKeys = fn => hashMap => {
  const sortedItems = Object.keys(hashMap)
    .map(key => ({ key, item: hashMap[key] }))
    .sort((a, b) => (fn(a) > fn(b) ? -1 : 1))
  return sortedItems.reduce(
    (acc, item) => Object.assign({}, acc, { [item.key]: item.item }),
    {}
  )
}

const sortByValue = sortKeys(value => value.item)

module.exports = {
  sortByValue
}
