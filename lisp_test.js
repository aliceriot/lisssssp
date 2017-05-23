const {
  lex,
  __test__: {
    chop,
    LEFT_PAREN,
    RIGHT_PAREN,
    NUM_LITERAL
  }
} = require('./lisp')

const test = require('ava')

test('chop should remove characters matching regex', t => {
  t.is(chop(/abc/, 'abcdef'), 'def')
})

test('chop should remove leading whitespace, after character matches', t => {
  t.is(chop(/abc/, 'abc  def'), 'def')
})

test('lex should lex left paren', t => {
  let string = '('
  t.deepEqual(lex(string), [ { type: LEFT_PAREN }])
})

test('lex should lex multiple left parens', t => {
  t.deepEqual(lex('(('), [1, 2].map(() => ({ type: LEFT_PAREN })))
})

test('lex should lex right paren', t => {
  t.deepEqual(lex(')'), [{ type: RIGHT_PAREN }])
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
    let expected = expectation.map(val => ({type: NUM_LITERAL, value: val }))
    t.deepEqual(lex(string), expected)
  })
})
