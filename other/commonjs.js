var example = require('./commonjs-1') //如果参数字符串以“./”开头，则表示加载的是一个位于相对路径
console.log(example.x) // 5
console.log(example.addX(1)) // 6
