const frontend = require('../output/stats/all/answers/datalayer.json')

const processCategoryQuestion = require('../src/satisfaction')

const result = processCategoryQuestion(frontend)

console.log(JSON.stringify(result))
