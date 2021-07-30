import { readFile } from "fs/promises"

export const readFileToString = async (path: string): Promise<string> => {
  let file = await readFile(path)
  return String(file)
}
