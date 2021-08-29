import { lex } from "./lexer"
import {
  UnmatchedParenthesesError,
  throwIfNegative,
  checkParenBalance,
  checkBracketBalance,
} from "./parser"

test("UnmatchedParenthesesError should return an object", () => {
  expect(["message", "name"]).toEqual(Object.keys(UnmatchedParenthesesError()))
})

test('UnmatchedParenthesesError should return a thing suitable for "throw"', () => {
  expect(() => {
    throw UnmatchedParenthesesError()
  }).toThrow()
})

test("throwIfNegative should live up to its name", () => {
  expect(3).toBe(throwIfNegative(3))
  expect(0).toBe(throwIfNegative(0))
  expect(() => throwIfNegative(-1)).toThrow()
})

test("checkParenBalance should return true if the parens are balanced", () => {
  ;[
    "(())",
    "((()[[()))",
    "(((()])((])([)())))",
    "((lambda [x] (add x y)))",
  ].forEach((lispyString) => {
    expect(checkParenBalance(lex(lispyString))).toBeTruthy()
  })
})

test("checkParenBalance should throw if the parens are not balanced", () => {
  ;["((", "())", "()())))(", ")))))", "((((((("].forEach((unbalanced) => {
    expect(() => checkParenBalance(lex(unbalanced))).toThrow()
  })
})

test("checkBracketBalance should return true if the brackets are balanced", () => {
  ;["[]", "[[]]", "[][[[[]]]]", "((lambda [x] (add x y)))"].forEach(
    (bracketString) => {
      expect(checkBracketBalance(lex(bracketString))).toBeTruthy()
    }
  )
})

test("checkBracketBalance should throw if the brackets are not balanced", () => {
  ;["[[", "[]]", "[[[][][]]]]]]", "(([ [))"].forEach((unbalanced) => {
    expect(() => checkBracketBalance(lex(unbalanced))).toThrow()
  })
})
