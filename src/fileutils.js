import fs from 'fs'

export const readFile = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

export const readFileToString = async (path) => {
  let file = await readFile(path)
  return String(file)
}
