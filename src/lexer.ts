import { Token, TOKEN_MANIFEST } from "./tokens"

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

/**
 * A utility function that takes a regex and a string returns
 * the result of chopping the substring matching that regex off
 * the front of a string.
 *
 * This lets you go along and chop the bits matching your tokens off!
 */
export const chop = (regex: RegExp, string: string): string =>
  string.replace(regex, "").replace(/^\s*/, "")

export const AmbiguousLexingError = (tokens: Token[]) => {
  let message =
    "I was trying to parse your code but I could not disambiguate these tokens:\n"
  message += JSON.stringify(tokens)

  return {
    message: message,
    name: "AmbiguousLexingError",
  }
}

export const UnmatchedTokenError = (string: string) => {
  let message = `I couldn't find a match with a declared token when parsing:\n${string}`

  return {
    message: message,
    name: "UnmatchedTokenError",
  }
}

export const lex = (code: string) => {
  let strncpy = code.concat()

  let tokens: Token[] = []

  while (strncpy.length > 0) {
    let newString

    let newTokens: Token[] = []

    TOKEN_MANIFEST.forEach(([tokenBuilder, regex]) => {
      if (strncpy.match(regex)) {
        let token = tokenBuilder(strncpy.match(tokenCls.regex)!)
        newString = chop(tokenCls.regex, strncpy)

        newString = chop(tokenCls.regex, strncpy)
        newTokens.push(token)
      }
    })

    if (newTokens.length > 1) {
      throw AmbiguousLexingError(newTokens)
    }

    if (newString === undefined) {
      throw UnmatchedTokenError(strncpy)
    }

    tokens = tokens.concat(newTokens)
    strncpy = newString
  }
  return tokens
}
