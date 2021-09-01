import { curry } from "./functools"
import { Token, TokenVariant } from "./tokens"

// Parser!
//
// Here is our parser. It takes a list of tokens and builds it into an AST,
// which we can then interpret.

export const UnmatchedParenthesesError = () => ({
  message: "You program does not have matching parentheses",
  name: "UnmatchedParenthesesError",
})

export const throwIfNegative = (num: number) => {
  if (num < 0) {
    throw UnmatchedParenthesesError()
  }
  return num
}

export const checkForBalance = curry(
  (leftType: TokenVariant, rightType: TokenVariant, tokens: Token[]) => {
    let count = tokens.reduce((count: number, token: Token): number => {
      if (token.variant === leftType) {
        return count + 1
      }

      if (token.variant === rightType) {
        let newCount = count - 1

        if (newCount < 0) {
          throw UnmatchedParenthesesError()
        }

        return newCount
      }

      return count
    }, 0)

    if (count !== 0) {
      throw UnmatchedParenthesesError()
    }

    return true
  }
)

export const checkParenBalance = checkForBalance(
  TokenVariant.LEFT_PAREN,
  TokenVariant.RIGHT_PAREN
)

export const checkBracketBalance = checkForBalance(
  TokenVariant.LEFT_BRACKET,
  TokenVariant.RIGHT_BRACKET
)

export function parser (tokens: Token[]) {
  checkParenBalance(tokens)
  checkBracketBalance(tokens)
}
