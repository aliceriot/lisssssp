import test from 'ava'

import { lex } from './lisp'
import {
  UnmatchedParenthesesError,
  throwIfNegative,
  checkParenBalance,
  checkBracketBalance
} from './parser.js'

test('UnmatchedParenthesesError should return an object', t => {
  t.deepEqual(['message', 'name'], Object.keys(UnmatchedParenthesesError()))
})

test('UnmatchedParenthesesError should return a thing suitable for "throw"', t => {
  t.throws(() => {
    throw UnmatchedParenthesesError()
  })
})

test('throwIfNegative should live up to its name', t => {
  t.is(3, throwIfNegative(3))
  t.is(0, throwIfNegative(0))
  t.throws(() => throwIfNegative(-1))
})

test('checkParenBalance should return true if the parens are balanced', t => {
  ['(())', '((()[[()))', '(((()])((])([)())))', '((lambda [x] (add x y)))'].forEach(lispyString => {
    t.true(checkParenBalance(lex(lispyString)))
  })
})

test('checkParenBalance should throw if the parens are not balanced', t => {
  ['((', '())', '()())))(', ')))))', '((((((('].forEach(unbalanced => {
    t.throws(() => checkParenBalance(lex(unbalanced)))
  })
})

test('checkBracketBalance should return true if the brackets are balanced', t => {
  ['[]', '[[]]', '[][[[[]]]]', '((lambda [x] (add x y)))'].forEach(bracketString => {
    t.true(checkBracketBalance(lex(bracketString)))
  })
})

test('checkBracketBalance should throw if the brackets are not balanced', t => {
  ['[[', '[]]', '[[[][][]]]]]]', '(([ [))'].forEach(unbalanced => {
    t.throws(() => checkBracketBalance(lex(unbalanced)))
  })
})
