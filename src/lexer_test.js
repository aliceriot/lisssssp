import test from 'ava'

import {
  chop,
  AmbiguousLexingError,
  lexer,
  removeEmpties
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

test('chop should remove characters matching regex', t => {
  t.is(chop(/abc/, 'abcdef'), 'def')
})

test('chop should remove leading whitespace, after character matches', t => {
  t.is(chop(/abc/, 'abc  def'), 'def')
})

test('remove empties should return empty for an empty object', t => {
  t.false(removeEmpties({}))
})

test('remove removeEmpties should return true for a non-empty object', t => {
  t.true(removeEmpties({foo: 'bar'}))
})

test('AmbiguousLexingError should return an object', t => {
  t.deepEqual(['message', 'name'], Object.keys(AmbiguousLexingError('foobar')))
})

test('AmbiguousLexingError should return a thing suitable for "throw"', t => {
  t.throws(() => {
    throw AmbiguousLexingError('HEY')
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

test('lex should lex left paren', t => {
  t.deepEqual(lex('('), [leftParen])
  t.deepEqual(lex('(('), [1, 2].map(() => leftParen))
})

test('lex should lex right paren', t => {
  t.deepEqual(lex(')'), [{ type: RIGHT_PAREN }])
  t.deepEqual(lex('))'), [1, 2].map(() => rightParen))
})

test('lex should let you get a lot of parens going', t => {
  t.deepEqual(lex('(((((((((((((((('), Array.apply(null, { length: 16 }).map(() => leftParen))
})

test('lex should lex left bracket', t => {
  t.deepEqual(lex('['), [leftBracket])
  t.deepEqual(lex('[['), [1, 2].map(() => leftBracket))
  t.deepEqual(lex('[[[[[ [[[[[[[ [[[['), Array.apply(null, { length: 16 }).map(() => leftBracket))
})

test('lex should lex right bracket', t => {
  t.deepEqual(lex(']'), [rightBracket])
  t.deepEqual(lex(']]'), [1, 2].map(() => rightBracket))
  t.deepEqual(lex(']]]]] ]]]]]]] ]]]]'), Array.apply(null, { length: 16 }).map(() => rightBracket))
})

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
