import { lexer } from "./lexer"

// First, we need a lexer. Let's write one! A good lexer will
// take a string and return the tokens that make up that string.

// Before we can do that though, let's write down which things
// are valid in our lisp!
export enum TokenVariant {
  LEFT_PAREN = "LEFT_PAREN",
  RIGHT_PAREN = "RIGHT_PAREN",
  LEFT_BRACKET = "LEFT_BRACKET",
  RIGHT_BRACKET = "RIGHT_BRACKET",
  NUM_LITERAL = "NUM_LITERAL",
  STRING_LITERAL = "STRING_LITERAL",
  IDENTIFIER = "IDENTIFIER",
}

export const parseString = (match: RegExpMatchArray) => {
  return match[0].replace(/^"/, "").replace(/"$/, "")
}

export const parseNumber = (match: RegExpMatchArray) => parseInt(match[0])

export const getIdentifier = (match: RegExpMatchArray) => match[0]

export interface TokenDescriptor {
  type: TokenVariant
  regex: RegExp
  valueFunc?: (match: RegExpMatchArray) => number | string
}

export interface Token {
  type: TokenVariant
  value?: number | string
}

export const LISP_TOKEN_MANIFEST: TokenDescriptor[] = [
  { type: TokenVariant.LEFT_PAREN, regex: /^\(/ },
  { type: TokenVariant.RIGHT_PAREN, regex: /^\)/ },
  { type: TokenVariant.LEFT_BRACKET, regex: /^\[/ },
  { type: TokenVariant.RIGHT_BRACKET, regex: /^\]/ },
  { type: TokenVariant.NUM_LITERAL, regex: /^\d+/, valueFunc: parseNumber },
  { type: TokenVariant.STRING_LITERAL, regex: /^".*"/, valueFunc: parseString },
  {
    type: TokenVariant.IDENTIFIER,
    regex: /^[A-Za-z]+/,
    valueFunc: getIdentifier,
  },
]

// we create a lexer a passing our token manifest to the lexer generator
// we already built (snazzy)
export const lex = lexer(LISP_TOKEN_MANIFEST)
