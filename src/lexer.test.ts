import { chop, AmbiguousLexingError, UnmatchedTokenError, lex } from "./lexer"
import {
  Identifier,
  LeftBracket,
  LeftParen,
  NumLiteral,
  RightBracket,
  RightParen,
  StringLiteral,
} from "./tokens"
import { Token, TokenVariant } from "./tokens"

const numExp = (n: number): Token => new NumLiteral(String(n))

const stringLiteral = (str: string): Token => new StringLiteral(str)

const identifier = (id: string): Token => new Identifier(id)

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

function lexingSingleCharacterMacro(string: string, token: Token) {
  // @ts-ignore
  expect(lex(string)[0].variant).toEqual(token.variant)
}

lexingSingleCharacterMacro.title = (
  _provided: any,
  string: string,
  type: TokenVariant
) => `lex should lex ${type} (${string})`

test(`lex should lex ${TokenVariant.LEFT_PAREN}`, () => {
  lexingSingleCharacterMacro("(", new LeftParen())
})

test(`lex should lex ${TokenVariant.RIGHT_PAREN}`, () => {
  lexingSingleCharacterMacro(")", new RightParen())
})

test(`lex should lex ${TokenVariant.LEFT_BRACKET}`, () => {
  lexingSingleCharacterMacro("[", new LeftBracket())
})

test(`lex should lex ${TokenVariant.RIGHT_BRACKET}`, () => {
  lexingSingleCharacterMacro("]", new RightBracket())
  expect(lex("]")).toEqual([new RightBracket()])
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
    let expected = expectation.map((val: any) => new NumLiteral(String(val)))
    expect(lex(string)).toEqual(expected)
  })
})

test("lex should lex numbers and parens", () => {
  let expected = [new LeftParen(), numExp(3), numExp(4), new RightParen()]
  expect(lex("( 3 4     )")).toEqual(expected)
})

test("lex should lex string literals", () => {
  let expected = [stringLiteral("mystring")]
  expect(lex('"mystring"')).toEqual(expected)
})

test("lex should mix strings, nums, parens", () => {
  let lisp = '("foo" 3 345 () )'
  let expected = [
    new LeftParen(),
    stringLiteral("foo"),
    numExp(3),
    numExp(345),
    new LeftParen(),
    new RightParen(),
    new RightParen(),
  ]
  expect(lex(lisp)).toEqual(expected)
})

test("lex should support identifiers", () => {
  let lisp = "(add 2 3)"
  let expected = [
    new LeftParen(),
    identifier("add"),
    numExp(2),
    numExp(3),
    new RightParen(),
  ]
  expect(lex(lisp)).toEqual(expected)
})

test("lex should support slightly more complicated expressions", () => {
  let lambda = '((lambda (x) x) "lambda wow")'
  let expected = [
    new LeftParen(),
    new LeftParen(),
    identifier("lambda"),
    new LeftParen(),
    identifier("x"),
    new RightParen(),
    identifier("x"),
    new RightParen(),
    stringLiteral("lambda wow"),
    new RightParen(),
  ]
  expect(lex(lambda)).toEqual(expected)
})

test("lex should let you use square brackets for function args", () => {
  let lisp = "((lambda [x y] (add x y)) 1 2)"
  let expected = [
    new LeftParen(),
    new LeftParen(),
    identifier("lambda"),
    new LeftBracket(),
    identifier("x"),
    identifier("y"),
    new RightBracket(),
    new LeftParen(),
    identifier("add"),
    identifier("x"),
    identifier("y"),
    new RightParen(),
    new RightParen(),
    numExp(1),
    numExp(2),
    new RightParen(),
  ]
  expect(lex(lisp)).toEqual(expected)
})
