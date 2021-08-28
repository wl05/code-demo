const foo = (function CoolModule() { 
  let count = 0
  function increment() {
    // 修改公共 API
    count++
  }
  function consoleCount() {
    console.log( count );
  }
  const publicAPI = { 
    increment,
    consoleCount
  };
  return publicAPI;
})();
foo.consoleCount(); // 0
foo.increment();
foo.consoleCount(); // 1