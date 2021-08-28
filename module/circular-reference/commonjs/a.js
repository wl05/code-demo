module.exports.a = 1
var b = require('./b')
console.log(b)
module.exports.a = 2

// 1
// 22
