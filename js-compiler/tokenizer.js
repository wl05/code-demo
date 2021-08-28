const constants = require("./constants")
const KEYWORD = /let/ // 匹配关键字
const PUNCTUATOR = /[\=;]/ // 匹配"="、";" 
const WHITESPACE = /\s/ // 匹配空格
const LETTERS = /[a-z]/i // 匹配字符
const {TokenTypes } = constants

function tokenizer(input) {
  const tokens = [] // token列表存储token，并最终返回
  let current = 0 // 标记遍历到字符串的什么位置

  // 用while循环遍历代码字符串，直到遍历完整个字符串
  while (current < input.length) {
    let char = input[current] // 暂存一下当前遍历到的字符

    // *************** 处理关键字和变量名 ***************
    if (LETTERS.test(char)) {
      let value = ''
      // 用一个循环遍历所有的字母，把它们存入 value 中。
      while (LETTERS.test(char)) {
        value += char
        char = input[++current]
      }
      
      if(KEYWORD.test(value)) { // 判断当前字符串是否是关键字
        // 记入关键字
        tokens.push({
           type: TokenTypes.Keyword,
           value: value
        })
      } else { // 否则是变量名
         // 记入变量名
         tokens.push({
           type: TokenTypes.Identifier,
           value: value
         })
       }
       // 进入下一次循环
       continue
    }

    // *************** 检查是否是符号，"="、";" ***************
    if (PUNCTUATOR.test(char)) {
      const punctuators = char // 创建变量用于保存匹配的符号
      current++
      // 记入符号
      tokens.push({
        type: TokenTypes.Punctuator,
        value: punctuators
      })
      // 进入下一次循环
      continue
    }

    // *************** 处理空格，遇到空格直接跳过 ***************
    if (WHITESPACE.test(char)) {
      current++
      continue
    }
    
    // *************** 处理字符串 ***************
    if (char === '"') {
      let value = ''
      char = input[++current] // 忽略掉开头的引号
      // 直到遇到下一个引号结束遍历
      while (char !== '"') {
        value += char
        char = input[++current]
      }
      char = input[++current] // 忽略掉结尾的引号
      tokens.push({ type: TokenTypes.String, value: '"'+value+'"' })
      continue
    }
    // *************** 如果不满足当前的匹配规则抛出错误 ***************
    throw new TypeError('Unknown' + char)
  }
  return tokens
}

module.exports = tokenizer