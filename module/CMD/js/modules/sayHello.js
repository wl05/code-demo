define(function (require, exports, module) {
  require.async('./asyncPrint', function (asyncPrint) {
    asyncPrint.print('async hello world')
  })
  const print = require('./print')
  print.print('hello world')
})
