import { Token, TOKEN_MANIFEST } from "./tokens"

// Lexer
//
// This modules defines the lexer for our lisp dialect. It uses the
// tokens declared in `./tokens` to parse a string into an array of
// Token objects.

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

    TOKEN_MANIFEST.forEach((TokenClass) => {
      let match = strncpy.match(TokenClass.regex)
      if (match) {
        let token = new TokenClass(match[0])
        newString = chop(TokenClass.regex, strncpy)
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
