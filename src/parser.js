import { curry } from './functools'
import {
  LEFT_PAREN,
  LEFT_BRACKET,
  RIGHT_PAREN,
  RIGHT_BRACKET
} from './lisp'

// Parser!
//
// Here is our parser. It takes a list of tokens and builds it into an AST,
// which we can then interpret.

export const UnmatchedParenthesesError = () => ({
  message: 'You program does not have matching parentheses',
  name: 'UnmatchedParenthesesError'
})

export const throwIfNegative = num => {
  if (num < 0) {
    throw UnmatchedParenthesesError()
  }
  return num
}

export const checkForBalance = curry((leftType, rightType, tokens) => {
  let count = tokens.reduce((count, token) => {
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

export const checkParenBalance = checkForBalance(LEFT_PAREN, RIGHT_PAREN)

export const checkBracketBalance = checkForBalance(LEFT_BRACKET, RIGHT_BRACKET)

// const parser =
