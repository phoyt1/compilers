function Calculator(inputString){
  this.tokenStream = this.lexer(inputString);

}
function TreeNode(name, ...children){
  this.name = name;
  // var args = [].slice.call(arguments);
  this.children = children;
}

Calculator.prototype.lexer = function(input){
    var tokenTypes = [
    ["NUMBER",    /^\d+/ ],
    ["ADD",       /^\+/  ],
    ["SUB",       /^\-/  ],
    ["MUL",       /^\*/  ],
    ["DIV",       /^\//  ],
    ["LPAREN",    /^\(/  ],
    ["RPAREN",    /^\)/  ]
  ];
  var tokens = [];
  var validToken;
  for (var i = 0; i < input.length; i++) {
    validToken = false;
    tokenTypes.forEach(function(token){
      var tokenRegEx = new RegExp(token[1]);
      if(tokenRegEx.test(input[i])){
        tokens.push({"name":token[0], "value":input[i]});
        validToken = true;
      }

    });
    if(!validToken) throw new Error("Found unparseable token: " + input[i]);
  }
  return tokens;
  }


Calculator.prototype.peek = function(){
  return this.tokenStream[0] || null;
}

Calculator.prototype.get = function(){
  return this.tokenStream.shift();
}

Calculator.prototype.parseExpression = function () {
  var term = this.parseTerm();
  var a = this.parseA();

  return new TreeNode("Expression", term, a);
}

Calculator.prototype.parseTerm = function(){
  // T => F B
  var factor = this.parseFactor();
  var b = this.parseB();

  return new TreeNode("Term", factor, b);
}
/*
    A = + Term A
    A = - Term A
    A = e
*/
Calculator.prototype.parseA = function () {
  var nextToken = this.peek();
  if(nextToken && nextToken.name === "ADD") {
    this.get();
    return new TreeNode("A", "+", this.parseTerm(), this.parseA());
  } else if(nextToken && nextToken.name == "SUB") {
    this.get();
    return new TreeNode("A", "-", this.parseTerm(), this.parseA());
  } else {
    return new TreeNode("A")
  }
};
/*
B => * F B
     / F B
     epsilon
*/
Calculator.prototype.parseB = function () {
  var nextToken = this.peek();
  if(nextToken && nextToken.name === "MUL") {
    this.get();
    return new TreeNode("B", "*", this.parseFactor(), this.parseB());
  } else if(nextToken && nextToken.name == "DIV") {
    this.get();
    return new TreeNode("B", "/", this.parseFactor(), this.parseB());
  } else {
    return new TreeNode("B")
  }
};
// F => ( E )
//      - F
//      NUMBER
Calculator.prototype.parseFactor = function () {
  var nextToken = this.peek();
  if(nextToken && nextToken.name === "LPAREN"){
    this.get();
    var expr = this.parseExpression();
    this.get();
    return new TreeNode("Factor", "(", expr, ")");
  }else if(nextToken && nextToken.name === "SUB"){
    this.get();
    return new TreeNode("F","-",this.parseFactor());
  }else if(nextToken && nextToken.name === "NUMBER"){
    return new TreeNode("Factor", this.get().value);
  }
}
// var calculator = new Calculator("(3)");

// // make a fake version of parseExpression
// var fakeExpressionTreeNode = new TreeNode("Expression", "3");
// calculator.parseExpression = function() {
//   this.get(); // remove the 3 when parseFactor runs
//   return fakeExpressionTreeNode;
// }

// var output = calculator.parseFactor();
// console.log(output.name);
// console.log(output.children);
// check that
// output.name == "Factor"
// output.children = ["(", fakeExpressionTreeNode, ")"];




// var calc = new Calculator("1+(2*3)+4");
// //calc.lexer();
// console.log(calc.peek());
// console.log(calc.get());
