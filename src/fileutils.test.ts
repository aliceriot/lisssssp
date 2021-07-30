import { readFileToString } from "./fileutils"

test("readFileToString should return a promise", async () => {
  const string = await readFileToString("package.json")
  expect(string.constructor).toBe(String)
})
