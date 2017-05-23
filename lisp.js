// L I S S S S S P (LI5P)
//
// I'm writing lisp, in JS! It's going to be terrible
// and also fun.

// First, we need a lexer. Let's write one! A good lexer will
// take a string and return the tokens that make up that string.

// Before we can do that though, let's write down which things
// are valid in our lisp!
const LEFT_PAREN = 'LEFT_PAREN'

const RIGHT_PAREN = 'RIGHT_PAREN'

const NUM_LITERAL = 'NUM_LITERAL'

const chop = (regex, string) => string
  .replace(regex, '')
  .replace(/^\s*/, '')

const lex = (string, tokens = []) => {
  // handle base case
  if (string === '') {
    return []
  }

  // parentheses
  if (string.match(/^\(/)) {
    return tokens.concat({ type: LEFT_PAREN }, lex(chop(/^\(/, string)))
  }

  if (string.match(/^\)/)) {
    return tokens.concat({type: RIGHT_PAREN}, lex(chop(/^\)/, string)))
  }

  // number literals
  if (string.match(/^\d+/)) {
    return tokens.concat({
      type: NUM_LITERAL,
      value: parseInt(string.match(/^\d+/))
    }, lex(chop(/^\d+/, string)))
  }

  return []
}

module.exports = {
  lex: lex,

  __test__: {
    LEFT_PAREN,
    RIGHT_PAREN,
    NUM_LITERAL,
    chop
  }

}
