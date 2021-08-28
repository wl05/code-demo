const tokenizer = require("../tokenizer")
test('tokenizer', () => {
  expect(tokenizer('let name = "张三";')).toStrictEqual([{"type": "Keyword", "value": "let"}, {"type": "Identifier", "value": "name"}, {"type": "Punctuator", "value": "="}, {"type": "String", "value": "\"张三\"",}, {"type": "Punctuator", "value": ";"}])
})