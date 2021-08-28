const constants = require("./constants")
const {TokenTypes, AST_Types } = constants

// 语法解析函数，接收 tokens 作为参数
function parser(tokens) {
  // 记录当前遍历到tokens的哪个位置
  let current = 0

  // 通过遍历来解析token节点，定义 walk 函数
  // 对于不同类型的结点，对应的处理方法也不同
  function walk() {
    // 从当前 token 开始解析
    const token = tokens[current]

    // *************** 检查是不是字符串 ***************
    if (token.type === TokenTypes.String) {
      // 如果是 current 自增。
      current++;
      // 然后返回一个新的 AST 结点
      return {
        type: AST_Types.Literal,
        value: JSON.parse(token.value),
        row: token.value
      }
    }
   
    // *************** 检查是不是变量名 ***************
    if (token.type === TokenTypes.Identifier) {
      // 如果是，current 自增。
      current++;
      // 然后返回一个新的 AST 结点
      return {
        type: AST_Types.Identifier,
        name: token.value,
      };
    }

    // *************** 检查是不是运算符关键字 ***************
    if (token.type === TokenTypes.Punctuator) {
      // 如果是，current 自增。
      current++;
      // 判断是否是=号
      if(/\=/.test(token.value)){
        return {
          type: AST_Types.AssignmentExpression,
          operator: token.value
        }
      }else{ // 忽略掉;号，不算入AST中
        return
      }
    }

    // *************** 检查是不是关键字 ***************
    if ( token.type === TokenTypes.Keyword) {
      var value = token.value
      current++; // 这里current++，因为紧跟声明语句的就是变量名，下一步walk就可以返回变量名
      const variable = walk() // 获取定义的变量
      current++ // 下一个应该是=号，我们这里直接current++略过，不算入AST中
      const rightVar = walk()
      current++ // 下一个应该是;号，我们这里直接current++略过，不算入AST中
      
      // 定义声明
      const declaration = {
        type: AST_Types.VariableDeclarator,
        id: variable, // 定义的变量
        init: rightVar // 赋予的值
      }
      // 定义要返回的节点
      return {
        type: AST_Types.VariableDeclaration,
        declarations: [declaration],
        kind: value,
      };
    }
    // *************** 遇到了一个类型未知的结点，就抛出一个错误。 ***************
    throw new TypeError(token.type);
  }
  // 创建 AST，定义根结点是一个类型为 `Program` 的结点。
  const ast = {
    type: AST_Types.Program,
    body: [],
    sourceType: "script"
  };

  // 开始 walk 函数，把结点放入 ast.body 中。
  while (current < tokens.length) {
    ast.body.push(walk());
  }
  return ast;
}


module.exports = parser