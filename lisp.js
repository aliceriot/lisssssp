// L I S S S S S P (LI5P)
// 
// I'm writing lisp, in JS! It's going to be terrible
// and also fun.

// First, we need a lexer. Let's write one! A good lexer will
// take a string and return the tokens that make up that string.

// Before we can do that though, let's write down which things
// are valid in our lisp!
const LEFT_PAREN = 'LEFT_PAREN';

const RIGHT_PAREN = 'RIGHT_PAREN';

const NUM_LITERAL = 'NUM_LITERAL';

const chop = (regex, string) => string.replace(regex, "")

const lexer = (string, tokens = []) => {
  // parentheses
  if (string.match(/\(/)) {
    return tokens.concat({ type: LEFT_PAREN }, lexer(chop(/^\(/, string)));
  }
};


module.exports = {
  lexer
};
