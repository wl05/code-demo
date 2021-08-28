const TokenTypes = {
  Keyword: "Keyword",
  Identifier: "Identifier",
  Punctuator: "Punctuator",
  String: "String"
}

const AST_Types = {
  Program: "Program",
  VariableDeclaration: "VariableDeclaration",
  VariableDeclarator: "VariableDeclarator",
  AssignmentExpression: "AssignmentExpression",
  Identifier: "Identifier",
  Literal: "Literal",
}

module.exports = {
  TokenTypes,
  AST_Types
}