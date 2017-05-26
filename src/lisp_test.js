import test from 'ava'

import {
  lex,
  parseString,
  getIdentifier
} from './lisp.js';

test('it should define a lexer', t => {
  t.truthy(lex("()"))
})

test('parseString should remove double quotes', t => {
  let match = ['"foobar"']
  t.is(parseString(match), 'foobar')
})

test('getIdentifier should pull the first thing out of an array', t => {
  t.is(getIdentifier(['hey', 'there']), 'hey')
})
