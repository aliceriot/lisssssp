import { lex, parseString, getIdentifier } from "./lisp"

test("it should define a lexer", () => {
  expect(lex("()")).toBeTruthy()
})

test("parseString should remove double quotes", () => {
  let match = ['"foobar"']
  expect(parseString(match)).toBe("foobar")
})

test("getIdentifier should pull the first thing out of an array", () => {
  expect(getIdentifier(["hey", "there"])).toBe("hey")
})
