const tokenizer = require("../tokenizer")
const parser = require("../parser")
test('parser', () => {
  const tokens = tokenizer('let name = "张三";')
  expect(parser(tokens)).toStrictEqual({"body": [{"declarations": [{"id": {"name": "name", "type": "Identifier"}, "init": {"row": "\"张三\"", "type": "Literal", "value": "张三"}, "type": "VariableDeclarator"}], "kind": "let", "type": "VariableDeclaration"}], "sourceType": "script", "type": "Program"})
})