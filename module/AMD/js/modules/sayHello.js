// 定义有依赖的模块
define(['print'], function (print) {
  function sayHello() {
    print.print('hello world')
  }
  // 暴露模块
  return { sayHello }
})
