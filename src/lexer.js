import { curry } from './functools'

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
//
// These 'token manifests' can also supply an optional 'valueFunc',
// which can be used to generate a value from the characters matching
// the token. The 'valueFunc' will be called with the return value
// of calling `.match` on the string with the supplied regular expression.

export const chop = (regex, string) => string
  .replace(regex, '')
  .replace(/^\s*/, '')

export const AmbiguousLexingError = tokens => {
  let message = 'I was trying to parse your code but I could not disambiguate these tokens:\n'
  message += JSON.stringify(tokens)

  return {
    message: message,
    name: 'AmbiguousLexingError'
  }
}

export const UnmatchedTokenError = string => {
  let message = `I couldn't find a match with a declared token when parsing:\n${string}`

  return {
    message: message,
    name: 'UnmatchedTokenError'
  };
}

export const removeEmpties = obj => Object.keys(obj).length !== 0

export const lexer = curry((tokenManifest, string) => {
  let strncpy = string.concat()

  let tokens = []

  while (strncpy.length > 0) {
    let newString

    let newTokens = tokenManifest
      .map(tokenDescriptor => {
        if (strncpy.match(tokenDescriptor.regex)) {
          let token = { type: tokenDescriptor.type }
          if (tokenDescriptor.valueFunc !== undefined) {
            token.value = tokenDescriptor.valueFunc(strncpy.match(tokenDescriptor.regex))
          }
          newString = chop(tokenDescriptor.regex, strncpy)
          return token
        } else {
          return {}
        }
      })
      .filter(removeEmpties)

    if (newTokens.length > 1) {
      throw AmbiguousLexingError(newTokens)
    }

    if (newString === undefined) {
      throw UnmatchedTokenError(strncpy);
    }

    tokens = tokens.concat(newTokens)
    strncpy = newString
  }
  return tokens
})
