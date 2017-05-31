import test from 'ava'

import {
  readFile,
  readFileToString
} from './fileutils.js'

test('readFile should return a promise', async t => {
  const contents = await readFile('package.json')
  t.truthy(contents)
  t.deepEqual(contents.constructor, Buffer)
})

test('readFile should reject if file not found', async t => {
  let badRead = readFile("fooooooo")
  await t.throws(badRead)
})

test('readFileToString should return a promise', async t => {
  const string = await readFileToString('package.json')
  t.deepEqual(string.constructor, String)
})

test('readFileToString should reject if file not found', async t => {
  const badRead = readFileToString("ASdfasdfasdfasDF")
  await t.throws(badRead)
})
