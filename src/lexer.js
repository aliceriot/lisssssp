import { curry } from './functools';

// Lexer-Generator
// 
// This is a simple function that allows us to generate a lexer
// for our little lisp. We feed it an array of object like
// 
// { type: TOKEN_NAME, regex: /regex/ }
// 
// the regular expression should be well-formed so as to just
// pick the relevant characters off of the beginning of the string
// being parsed.

export const chop = (regex, string) => string
  .replace(regex, '')
  .replace(/^\s*/, '')

export function AmbiguousLexingError(tokens) {
  this.message = "I was trying to parse your code but I could not disambiguate these tokens:\n"
  this.message += JSON.stringify(tokens)
  this.name = "AmbiguousLexingError"
}

export const removeEmpties = obj => Object.keys(obj).length !== 0

export const lexer = curry((tokenManifest, string) => {
  let strncpy = string.concat();

  let tokens = []

  while (strncpy.length > 0) {
    let newString

    let newTokens = tokenManifest
      .map(tokenDescriptor => {
        if ( strncpy.match(tokenDescriptor.regex) ) {
          let token = { type: tokenDescriptor.type }
          if ( tokenDescriptor.valueFunc !== undefined ) {
            token.value = tokenDescriptor.valueFunc(strncpy.match(tokenDescriptor.regex))
          }
          newString = chop(tokenDescriptor.regex, strncpy)
          return token
        } else {
          return {}
        }
      })
      .filter(removeEmpties)

    if ( newTokens.length > 1) {
      throw AmbiguousLexingError(newTokens)
    }

    tokens = tokens.concat(newTokens)
    strncpy = newString
  }
  return tokens
});
