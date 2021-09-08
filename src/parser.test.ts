import { lex } from "./lexer"
import { Token, TokenVariant } from './tokens'
import {
  UnmatchedParenthesesError,
  throwIfNegative,
  checkParenBalance,
  checkBracketBalance,
  takeUntilMatch,
  buildAST,
  prettyPrint,
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

test("takeUntilMatch should return a slice up until a match", () => {
  let tokens = lex("(lambda (x y) (+ x y))(1 2)")

  let [subsection, rest] = takeUntilMatch(
    TokenVariant.LEFT_PAREN,
    TokenVariant.RIGHT_PAREN,
    tokens.slice(1)
  )

  expect(subsection).toEqual(lex("lambda (x y) (+ x y)"))
  expect(rest).toEqual(lex("(1 2)"))
})

test("buildAST should build a simple AST", () => {
  let tokens = lex("(+ (+ 1 2) 3)")
  // console.log(tokens);
  // let ast = buildAST(tokens)
  // console.log(ast);

  // console.log(prettyPrint(
  //             ast)
  //            )
})



test("should be able to construct a more complicated AST", () => {
  let tokens = lex("(lambda (x y) (+ x y))(1 2)")

  let ast = buildAST(tokens)
  console.log(ast);

  console.log(
    prettyPrint(
      buildAST(
        tokens
      )
    )
  )
})

