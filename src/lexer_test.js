import test from 'ava'

import {
  chop,
  AmbiguousLexingError,
  lexer,
  removeEmpties
} from './lexer.js'

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
