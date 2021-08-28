// 定义没有依赖的模块
define(function () {
  function print(msg) {
    console.log(msg)
  }
  return { print } // 暴露模块
})
