import { curry } from "./functools"
import { AToken, TokenVariant} from "./tokens"

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

export const checkForBalance = curry((leftType: TokenVariant, rightType: TokenVariant, tokens: AToken[]) => {
  let count = tokens.reduce((count: number, token: AToken): number => {
    if (token.type === leftType) {
      return throwIfNegative(count + 1)
    }
    if (token.type === rightType) {
      return throwIfNegative(count - 1)
    }
    return count
  }, 0)

  if (count !== 0) {
    throw UnmatchedParenthesesError()
  }
  return true
})

export const checkParenBalance = checkForBalance(TokenVariant.LEFT_PAREN, TokenVariant.RIGHT_PAREN)

export const checkBracketBalance = checkForBalance(TokenVariant.LEFT_BRACKET, TokenVariant.RIGHT_BRACKET)

// const parser =
