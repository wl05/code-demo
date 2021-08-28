const constants = require("./constants")
const { AST_Types } = constants
/**
 * ast是一颗树形结构，采用深度优先进行遍历
 * traverser 接受两个参数ast，visitor
 * traverser负责遍历AST，visitor包含接受不同类型的节点和它们父节点的方法
 * 例如：
 * const visitor = {
 *   StringLiteral(node, parent) {},
 * };
 * 这些方法对匹配到的节点做增删改处理
 */
function traverser(ast, visitor) {
  // 遍历树中每个节点，调用 traverseNode
  function traverseArray(array, parent) {
    array.forEach(function(child) {
      traverseNode(child, parent);
    });
  }

  // 处理 ast 节点的函数, 使用 visitor 定义的转换函数进行转换
  function traverseNode(node, parent) {
    // 首先看看 visitor 中有没有对应 type 的处理函数。
    const method = visitor[node.type]
    // 如果有，调用处理方法
    if (method) {
      method(node, parent)
    }

    // 下面对每一个不同类型的结点分开处理。
    switch (node.type) {
      case AST_Types.Program: // 顶层的 Program 开始，body是数组所以调用traverseArray
        traverseArray(node.body, node) 
        break
      // 如果不需要转换，则直接退出
      case AST_Types.VariableDeclaration:
      case AST_Types.VariableDeclarator:
      case AST_Types.AssignmentExpression:
      case AST_Types.Identifier:
      case AST_Types.Literal:
        break
      // 同样，如果不能识别当前的结点，那么就抛出一个错误。
      default:
        throw new TypeError(node.type)
    }
  }
  // 触发遍历AST，根节点没有父节点所以这里传入null
  traverseNode(ast, null)
}


module.exports = traverser