function Calculator(inputString){
  this.tokenStream = this.lexer(inputString);

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


var calc = new Calculator("1+(2*3)+4");
//calc.lexer();
console.log(calc.peek());
console.log(calc.get());
