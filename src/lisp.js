import { lexer } from './lexer.js'
// L I S S S S S P (LI5P)
//

// First, we need a lexer. Let's write one! A good lexer will
// take a string and return the tokens that make up that string.

// Before we can do that though, let's write down which things
// are valid in our lisp!
export const LEFT_PAREN = 'LEFT_PAREN'

export const RIGHT_PAREN = 'RIGHT_PAREN'

export const NUM_LITERAL = 'NUM_LITERAL'

export const LISP_TOKEN_MANIFEST = [
  { type: LEFT_PAREN, regex: /^\(/ },
  { type: RIGHT_PAREN, regex: /^\)/ },
  { type: NUM_LITERAL, regex: /^\d+/, valueFunc: parseInt }
];

export const lex = lexer(LISP_TOKEN_MANIFEST)
