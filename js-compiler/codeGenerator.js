const constants = require("./constants")
const { AST_Types } = constants

function codeGenerator(node) {
  // 处理不同类型的结点
  switch (node.type) {
    // 如果是 Program 结点，遍历它的 body 属性中的每一个结点并加入换行符号
    case AST_Types.Program:
      return node.body.map(codeGenerator)
        .join('\n')
    
    case AST_Types.VariableDeclaration: // 处理变量声明
      return (
        node.kind + ' ' + node.declarations.map(codeGenerator)
      )
    case AST_Types.VariableDeclarator: // 处理声明的变量和值
      return (
        codeGenerator(node.id) + ' = ' + 
        codeGenerator(node.init)
      )
    case AST_Types.Identifier: // 变量名直接返回
      return node.name
    
    case AST_Types.Literal: // 字符串加上""、;返回
      return '"'+node.value+'"'+";"

    // 如果我们不能识别这个结点，那么抛出一个错误。
    default:
      throw new TypeError(node.type)
  }
}

module.exports = codeGenerator