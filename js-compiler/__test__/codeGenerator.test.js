const transformer = require("../transformer")
const tokenizer = require("../tokenizer")
const parser = require("../parser")
const codeGenerator = require("../codeGenerator")
test('codeGenerator', () => {
  const tokens = tokenizer('let name = "张三";')
  const ast = parser(tokens)
  const newAst = transformer(ast)
  const newCode = codeGenerator(newAst)
  expect(newCode).toStrictEqual("var name = \"张三\";")
})