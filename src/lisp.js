import { lexer } from './lexer.js'

// First, we need a lexer. Let's write one! A good lexer will
// take a string and return the tokens that make up that string.

// Before we can do that though, let's write down which things
// are valid in our lisp!
export const LEFT_PAREN = 'LEFT_PAREN'

export const RIGHT_PAREN = 'RIGHT_PAREN'

export const LEFT_BRACKET = 'LEFT_BRACKET'

export const RIGHT_BRACKET = 'RIGHT_BRACKET'

export const NUM_LITERAL = 'NUM_LITERAL'

export const STRING_LITERAL = 'STRING_LITERAL'

export const IDENTIFIER = 'IDENTIFIER'

export const parseString = match => {
  return match[0]
    .replace(/^"/, '')
    .replace(/"$/, '')
}

export const getIdentifier = match => match[0]

export const LISP_TOKEN_MANIFEST = [
  { type: LEFT_PAREN, regex: /^\(/ },
  { type: RIGHT_PAREN, regex: /^\)/ },
  { type: LEFT_BRACKET, regex: /^\[/ },
  { type: RIGHT_BRACKET, regex: /^\]/ },
  { type: NUM_LITERAL, regex: /^\d+/, valueFunc: parseInt },
  { type: STRING_LITERAL, regex: /^".*"/, valueFunc: parseString },
  { type: IDENTIFIER, regex: /^[A-Za-z]+/, valueFunc: getIdentifier }
]

// we create a lexer a passing our token manifest to the lexer generator
// we already built (snazzy)
export const lex = lexer(LISP_TOKEN_MANIFEST)
