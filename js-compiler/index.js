const transformer = require("./transformer")
const tokenizer = require("./tokenizer")
const parser = require("./parser")
const codeGenerator = require("./codeGenerator")

const tokens = tokenizer('let name = "张三";')
const ast = parser(tokens)
const newAst = transformer(ast)
const newCode = codeGenerator(newAst)


console.log(newCode) // var name = "张三";