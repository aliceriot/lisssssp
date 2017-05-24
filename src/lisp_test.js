import test from 'ava'

import {
  lex,
  LEFT_PAREN,
  RIGHT_PAREN,
  NUM_LITERAL,
  STRING_LITERAL,
  IDENTIFIER,
} from './lisp.js'

let leftParen = { type: LEFT_PAREN }

let rightParen = { type: RIGHT_PAREN }

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

test('lex should lex left paren', t => {
  let string = '('
  t.deepEqual(lex(string), [leftParen])
})

test('lex should lex multiple left parens', t => {
  t.deepEqual(lex('(('), [1, 2].map(() => ({ type: LEFT_PAREN })))
})

test('lex should lex right paren', t => {
  t.deepEqual(lex(')'), [{ type: RIGHT_PAREN }])
})

test('lex should let you get a lot of parens going', t => {
  t.deepEqual(lex('(((((((((((((((('), Array.apply(null, { length: 16 }).map(() => leftParen))
})

test('lex should lex multiple right parens', t => {
  t.deepEqual(lex('))'), [1, 2].map(() => ({ type: RIGHT_PAREN })))
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
    stringLiteral("foo"),
    numExp(3),
    numExp(345),
    leftParen,
    rightParen,
    rightParen
  ];
  t.deepEqual(lex(lisp), expected)
})

test('lex should support identifiers', t => {
  let lisp = '(add 2 3)'
  let expected = [leftParen, identifier('add'), numExp(2), numExp(3), rightParen]
  t.deepEqual(lex(lisp), expected)

})
