import { curry } from './functools';
import {
  LEFT_PAREN,
  LEFT_BRACKET,
  RIGHT_PAREN,
  RIGHT_BRACKET,
} from './lisp';

// Parser!
// 
// Here is our parser. It takes a list of tokens and builds it into an AST,
// which we can then interpret.

export const UnmatchedParenthesesError = () => ({
  message: "You program does not have matching parentheses",
  name: 'AmbiguousLexingError'
})

export const throwIfNegative = num => {
  if (num < 0) {
    throw UnmatchedParenthesesError();
  }
  return num
}

export const checkForBalance = curry((leftType, rightType, tokens) => {
  let [leftCount, rightCount] = tokens.reduce(([leftCount, rightCount], token) => {
    let nleftCount = throwIfNegative(token.type === leftType ? leftCount + 1 : leftCount)
    let nrightCount = throwIfNegative(token.type === rightType ? rightCount + 1 : rightCount)
    return [nleftCount, nrightCount]
  }, [0, 0])

  if (leftCount !== rightCount) {
    throw UnmatchedParenthesesError()
  }
  return true
})

export const checkParenBalance = checkForBalance(LEFT_PAREN, RIGHT_PAREN)

export const checkBracketBalance = checkForBalance(LEFT_BRACKET, RIGHT_BRACKET)

// const parser = 
