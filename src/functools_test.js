import test from 'ava'
import sinon from 'sinon'

import { curry } from './functools'

const add = (a, b, c) => a + b + c

test('curry should wrap a function and return a function', t => {
  let curried = curry(add)
  t.is(curried.constructor.name, 'Function')
})

test('wrapped function should return when given the right number of arguments', t => {
  let args = [1,2,3]
  t.is(args.length, add.length)
  let curried = curry(add)
  t.is(6, curried(1)(2)(3))
  t.is(6, curried(...args))
})

test('wrapped function should not execute if fewer args are passed', t => {
  let spy = sinon.spy(add)
  let curriedWithArgs = curry(spy)(1,2)
  t.false(spy.called)
  curriedWithArgs(3)
  t.true(spy.called)
});
