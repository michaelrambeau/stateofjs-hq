function transformId(id) {
  // list_55680622_choice_69899415
  const parts = /(list_.+)_(choice.*|other)/.exec(id)
  if (!parts) return id
  return parts[1]
}

module.exports = transformId
