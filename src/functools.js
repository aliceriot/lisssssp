export const curry = fn => {
  const acc = (...soFar) => (...nextArgs) => {
    let args = soFar.concat(nextArgs)
    return args.length >= fn.length
      ? fn(...args)
      : acc(...args)
  }
  return acc(...[])
}
