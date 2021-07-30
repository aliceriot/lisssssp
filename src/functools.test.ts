import sinon from "sinon"
import { curry } from "./functools"

const add = (a: number, b: number, c: number) => a + b + c

test("curry should wrap a function and return a function", () => {
  let curried = curry(add)
  expect(curried.constructor.name).toBe("Function")
})

test("wrapped function should return when given the right number of arguments", () => {
  let args = [1, 2, 3]
  expect(args.length).toBe(add.length)
  let curried = curry(add)
  expect(6).toBe(curried(1)(2)(3))
  expect(6).toBe(curried(1, 2, 3))
  expect(6).toBe(curried(1, 2)(3))
  expect(6).toBe(curried(1)(2, 3))
})

test("wrapped function should not execute if fewer args are passed", () => {
  let spy = sinon.spy(add)
  let curriedWithArgs = curry(spy)(1, 2)
  expect(spy.called).toBeFalsy()
  curriedWithArgs(3)
  expect(spy.called).toBeTruthy()
})
