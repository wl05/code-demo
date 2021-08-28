const transformer = require("../transformer")
const tokenizer = require("../tokenizer")
const parser = require("../parser")
test('transformer', () => {
  const tokens = tokenizer('let name = "张三";')
  const ast = parser(tokens)
  const newAst = transformer(ast)
  expect(newAst).toStrictEqual({"body": [{"declarations": [{"id": {"name": "name", "type": "Identifier"}, "init": {"row": "\"张三\"", "type": "Literal", "value": "张三"}, "type": "VariableDeclarator"}], "kind": "var", "type": "VariableDeclaration"}], "sourceType": "script", "type": "Program"})
})