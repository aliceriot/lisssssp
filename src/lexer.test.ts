import { chop, AmbiguousLexingError, UnmatchedTokenError, lex } from "./lexer"
import {LeftParen} from "./tokens"
import { Token, TokenVariant } from "./tokens"

const leftParen: AToken = { type: TokenVariant.LEFT_PAREN }
const rightParen: AToken = { type: TokenVariant.RIGHT_PAREN }
const leftBracket: AToken = { type: TokenVariant.LEFT_BRACKET }
const rightBracket: AToken = { type: TokenVariant.RIGHT_BRACKET }

const numExp = (n: number): AToken => ({
  type: TokenVariant.NUM_LITERAL,
  value: n,
})

const stringLiteral = (str: string): AToken => ({
  type: TokenVariant.STRING_LITERAL,
  value: str,
})

const identifier = (id: string): AToken => ({
  type: TokenVariant.IDENTIFIER,
  value: id,
})

function chopMacro(regex: RegExp, input: string, expectation: string) {
  expect(chop(regex, input)).toBe(expectation)
}

test(`chop(/abc/, abcdef) should be def`, () => {
  chopMacro(/abc/, "abcdef", "def")
})

test(`chop(/abc/, abc def) should be def`, () => {
  chopMacro(/abc/, "abc def", "def")
})

test("AmbiguousLexingError should return an object", () => {
  expect(["message", "name"]).toEqual(Object.keys(AmbiguousLexingError([])))
})

test('AmbiguousLexingError should return a thing suitable for "throw"', () => {
  expect(() => {
    throw AmbiguousLexingError([])
  }).toThrow()
})

test("UnmatchedTokenError should return an object", () => {
  expect(["message", "name"]).toEqual(Object.keys(UnmatchedTokenError("HI")))
})

test('UnmatchedTokenError should return a thing suitable for "throw"', () => {
  expect(() => {
    throw UnmatchedTokenError("HEY")
  }).toThrow()
})

test("lexer should throw if you supply it with badly formed tokens", () => {
  let collidingTokens = [
    { type: TokenVariant.LEFT_PAREN, regex: /^\D+/ },
    { type: TokenVariant.RIGHT_PAREN, regex: /^[a-z]+/ },
  ]
  let lex = lexer(collidingTokens)
  expect(() => {
    lex("this will throw")
  }).toThrow()
})

test("lexer should throw if you dont supply a token that matches your string", () => {
  let insufficientTokens = [{ type: TokenVariant.RIGHT_PAREN, regex: /^\w+/ }]
  let lex = lexer(insufficientTokens)
  expect(() => {
    lex("((just a (little lisp)))")
  }).toThrow()
})

const times = (n: number) => Array(n).fill(undefined)

const stringMultiply = (n: number, string: string): string =>
  times(n)
    .map(() => string)
    .join("")

const tokenArray = (n: number, type: TokenVariant) =>
  times(n).map(() => ({ type: type }))

function lexingSingleCharacterMacro(string: string, token: Token) {
  expect(lex(string)[0].variant).toEqual(type)
  expect(lex(stringMultiply(10, string))).toEqual(tokenArray(10, type))
  expect(lex(`${string}  ${string}${string} ${string}`)).toEqual(
    tokenArray(4, type)
  )
}

lexingSingleCharacterMacro.title = (
  _provided: any,
  string: string,
  type: TokenVariant
) => `lex should lex ${type} (${string})`

test(`lex should lex ${TokenVariant.LEFT_PAREN}`, () => {
  lexingSingleCharacterMacro("(", new LeftParen)
})
test(`lex should lex ${TokenVariant.RIGHT_PAREN}`, () => {
  lexingSingleCharacterMacro(")", TokenVariant.RIGHT_PAREN)
})

test(`lex should lex ${TokenVariant.LEFT_BRACKET}`, () => {
  lexingSingleCharacterMacro("[", TokenVariant.LEFT_BRACKET)
})
test(`lex should lex ${TokenVariant.RIGHT_BRACKET}`, () => {
  // lexingSingleCharacterMacro("]", TokenVariant.RIGHT_BRACKET)

  expect(lex("]")).toEqual(new RightBracket)
})

test("lex should lex num literal", () => {
  const cases: [string, number[]][] = [
    ["5", [5]],
    ["55", [55]],
    ["43 22", [43, 22]],
    ["123 3", [123, 3]],
    ["123 938 333", [123, 938, 333]],
  ]
  cases.forEach(([string, expectation]) => {
    let expected = expectation.map((val: any) => ({
      type: TokenVariant.NUM_LITERAL,
      value: val,
    }))
    expect(lex(string)).toEqual(expected)
  })
})

test("lex should lex numbers and parens", () => {
  let expected = [leftParen, numExp(3), numExp(4), rightParen]
  expect(lex("( 3 4     )")).toEqual(expected)
})

test("lex should lex string literals", () => {
  let expected = [stringLiteral("mystring")]
  expect(lex('"mystring"')).toEqual(expected)
})

test("lex should mix strings, nums, parens", () => {
  let lisp = '("foo" 3 345 () )'
  let expected = [
    leftParen,
    stringLiteral("foo"),
    numExp(3),
    numExp(345),
    leftParen,
    rightParen,
    rightParen,
  ]
  expect(lex(lisp)).toEqual(expected)
})

test("lex should support identifiers", () => {
  let lisp = "(add 2 3)"
  let expected = [
    leftParen,
    identifier("add"),
    numExp(2),
    numExp(3),
    rightParen,
  ]
  expect(lex(lisp)).toEqual(expected)
})

test("lex should support slightly more complicated expressions", () => {
  let lambda = '((lambda (x) x) "lambda wow")'
  let expected = [
    leftParen,
    leftParen,
    identifier("lambda"),
    leftParen,
    identifier("x"),
    rightParen,
    identifier("x"),
    rightParen,
    stringLiteral("lambda wow"),
    rightParen,
  ]
  expect(lex(lambda)).toEqual(expected)
})

test("lex should let you use square brackets for function args", () => {
  let lisp = "((lambda [x y] (add x y)) 1 2)"
  let expected = [
    leftParen,
    leftParen,
    identifier("lambda"),
    leftBracket,
    identifier("x"),
    identifier("y"),
    rightBracket,
    leftParen,
    identifier("add"),
    identifier("x"),
    identifier("y"),
    rightParen,
    rightParen,
    numExp(1),
    numExp(2),
    rightParen,
  ]
  expect(lex(lisp)).toEqual(expected)
})
