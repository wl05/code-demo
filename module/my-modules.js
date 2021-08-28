const Modules = (function () {
  const modules = {}
  return {
    define(name, dependencies, implementation) {
      for (let i = 0; i < dependencies.length; i++) {
        dependencies[i] = modules[dependencies[i]]
      }
      modules[name] = implementation.apply(implementation, dependencies)
    },
    require(name) {
      return modules[name]
    }
  }
})()

Modules.define('bar', [], function () {
  return {
    hello(who) {
      return 'I am ' + who
    }
  }
})
Modules.define('foo', ['bar'], function (bar) {
  const name = 'Tom'
  return {
    awesome() {
      console.log(bar.hello(name))
    }
  }
})
const bar = Modules.require('bar')
const foo = Modules.require('foo')
console.log(bar.hello('Jack')) // I am Jack
foo.awesome() // I am Tom
