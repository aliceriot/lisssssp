interface twoCurry<A, B, C> {
  (a: A): (b: B) => C
}
interface twoCurry<A, B, C> {
  (a: A, b: B): C
}

interface threeCurry<A, B, C, D> {
  (a: A): twoCurry<B, C, D>
}
interface threeCurry<A, B, C, D> {
  (a: A, b: B): (c: C) => D
}
interface threeCurry<A, B, C, D> {
  (a: A, b: B, c: C): D
}

export function curry<A, B, C>(fn: (a: A, b: B) => C): twoCurry<A, B, C>
export function curry<A, B, C, D>(
  fn: (a: A, b: B, c: C) => D
): threeCurry<A, B, C, D>
export function curry(fn: Function) {
  const acc =
    (...soFar: any[]) =>
    (...nextArgs: any[]) => {
      let args = soFar.concat(nextArgs)
      return args.length >= fn.length ? fn(...args) : acc(...args)
    }
  return acc(...[])
}
