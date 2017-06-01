import test from 'ava'

import {
  chop,
  AmbiguousLexingError,
  UnmatchedTokenError,
  lexer,
  isNotEmpty
} from './lexer.js'
import {
  lex,
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACKET,
  RIGHT_BRACKET,
  NUM_LITERAL,
  STRING_LITERAL,
  IDENTIFIER
} from './lisp.js'

let leftParen = { type: LEFT_PAREN }

let rightParen = { type: RIGHT_PAREN }

let leftBracket = { type: LEFT_BRACKET }

let rightBracket = { type: RIGHT_BRACKET }

const numExp = n => ({
  type: NUM_LITERAL,
  value: n
})

const stringLiteral = str => ({
  type: STRING_LITERAL,
  value: str
})

const identifier = id => ({
  type: IDENTIFIER,
  value: id
})

function chopMacro (t, regex, input, expectation) {
  t.is(chop(regex, input), expectation)
}

chopMacro.title = (provided, regex, input, expecation) => `chop(${regex}, ${input}) should be ${expecation}`

test(chopMacro, /abc/, 'abcdef', 'def')
test(chopMacro, /abc/, 'abc def', 'def')

function isNotEmptyMacro (t, input, expectation) {
  t.is(isNotEmpty(input), expectation)
}

isNotEmptyMacro.title = (provided, input, expectation) => (
  `isNotEmpty(${JSON.stringify(input)}) should be ${expectation}`
)

test(isNotEmptyMacro, {}, false)
test(isNotEmptyMacro, { foo: 'bar' }, true)

test('AmbiguousLexingError should return an object', t => {
  t.deepEqual(['message', 'name'], Object.keys(AmbiguousLexingError('foobar')))
})

test('AmbiguousLexingError should return a thing suitable for "throw"', t => {
  t.throws(() => {
    throw AmbiguousLexingError('HEY')
  })
})

test('UnmatchedTokenError should return an object', t => {
  t.deepEqual(['message', 'name'], Object.keys(UnmatchedTokenError('HI')))
})

test('UnmatchedTokenError should return a thing suitable for "throw"', t => {
  t.throws(() => {
    throw UnmatchedTokenError('HEY')
  })
})

test('lexer should throw if you supply it with badly formed tokens', t => {
  let collidingTokens = [
    { type: 'HEY', regex: /^\D+/ },
    { type: 'YOU', regex: /^[a-z]+/ }
  ]
  let lex = lexer(collidingTokens)
  t.throws(() => {
    lex('this will throw')
  })
})

test('lexer should throw if you dont supply a token that matches your string', t => {
  let insufficientTokens = [{ type: 'just words', regex: /^\w+/ }]
  let lex = lexer(insufficientTokens)
  t.throws(() => {
    lex('((just a (little lisp)))')
  })
})

const stringMultiply = (n, string) => (
  Array.apply('', { length: n }).map(() => string).join('')
)

const tokenArray = (n, type) => (
  Array.apply('', { length: n }).map(() => ({ type: type }))
)

function lexingSingleCharacterMacro (t, string, type) {
  t.deepEqual(lex(string), [{ type: type }])
  t.deepEqual(lex(stringMultiply(10, string)), tokenArray(10, type))
  t.deepEqual(
    lex(`${string}  ${string}${string} ${string}`),
    tokenArray(4, type)
  )
}

lexingSingleCharacterMacro.title = (provided, string, type) => (
  `lex should lex ${type} (${string})`
)

test(lexingSingleCharacterMacro, '(', LEFT_PAREN)
test(lexingSingleCharacterMacro, ')', RIGHT_PAREN)
test(lexingSingleCharacterMacro, '[', LEFT_BRACKET)
test(lexingSingleCharacterMacro, ']', RIGHT_BRACKET)

test('lex should lex num literal', t => {
  [
    ['5', [5]],
    ['55', [55]],
    ['43 22', [43, 22]],
    ['123 3', [123, 3]],
    ['123 938 333', [123, 938, 333]]
  ].forEach(([string, expectation]) => {
    let expected = expectation.map(val => ({ type: NUM_LITERAL, value: val }))
    t.deepEqual(lex(string), expected)
  })
})

test('lex should lex numbers and parens', t => {
  let expected = [leftParen, numExp(3), numExp(4), rightParen]
  t.deepEqual(lex('( 3 4     )'), expected)
})

test('lex should lex string literals', t => {
  let expected = [stringLiteral('mystring')]
  t.deepEqual(lex('"mystring"'), expected)
})

test('lex should mix strings, nums, parens', t => {
  let lisp = '("foo" 3 345 () )'
  let expected = [
    leftParen,
    stringLiteral('foo'),
    numExp(3),
    numExp(345),
    leftParen,
    rightParen,
    rightParen
  ]
  t.deepEqual(lex(lisp), expected)
})

test('lex should support identifiers', t => {
  let lisp = '(add 2 3)'
  let expected = [leftParen, identifier('add'), numExp(2), numExp(3), rightParen]
  t.deepEqual(lex(lisp), expected)
})

test('lex should support slightly more complicated expressions', t => {
  let lambda = '((lambda (x) x) "lambda wow")'
  let expected = [
    leftParen,
    leftParen,
    identifier('lambda'),
    leftParen,
    identifier('x'),
    rightParen,
    identifier('x'),
    rightParen,
    stringLiteral('lambda wow'),
    rightParen
  ]
  t.deepEqual(lex(lambda), expected)
})

test('lex should let you use square brackets for function args', t => {
  let lisp = '((lambda [x y] (add x y)) 1 2)'
  let expected = [
    leftParen, leftParen, identifier('lambda'), leftBracket,
    identifier('x'), identifier('y'), rightBracket, leftParen,
    identifier('add'), identifier('x'), identifier('y'),
    rightParen, rightParen, numExp(1), numExp(2), rightParen
  ]
  t.deepEqual(lex(lisp), expected)
})
