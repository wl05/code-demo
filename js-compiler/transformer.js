const traverser = require("./traverser")
const constants = require("./constants")
const { AST_Types } = constants

// transformer接收 AST 作为参数
function transformer(ast) {
  // newAst用于存储新的AST
  const newAst = {
    type: AST_Types.Program,
    body: [],
    sourceType: "script"
  };
  // 这里为了简便起见，直接将newAst.body挂载到了ast的_context属性上。
  // 这样处理完一个节点后可以通过当前节点的父节点拿到_context，然后通过push
  // 保存当前修改过的节点
  ast._context = newAst.body 
  // 将 AST 和 visitor 传入traverser中
  traverser(ast, {
    // 将let转换为var
    VariableDeclaration: function(node, parent) {
      const variableDeclaration = {
        type: AST_Types.VariableDeclaration,
        declarations: node.declarations,
        kind: "var"
      };
      // 把新的 VariableDeclaration 放入到 context 中。
      parent._context.push(variableDeclaration)
    }
  });
  // 最后返回新的AST
  return newAst
}


module.exports = transformer