import { curry } from "./functools"
import { Token, TokenVariant } from "./tokens"

// Parser!
//
// Here is our parser. It takes a list of tokens and builds it into an AST,
// which we can then interpret.

export const UnmatchedParenthesesError = () => ({
  message: "You program does not have matching parentheses",
  name: "UnmatchedParenthesesError",
})

export const throwIfNegative = (num: number) => {
  if (num < 0) {
    throw UnmatchedParenthesesError()
  }
  return num
}

export const checkForBalance = curry(
  (leftType: TokenVariant, rightType: TokenVariant, tokens: Token[]) => {
    let count = tokens.reduce((count: number, token: Token): number => {
      if (token.variant === leftType) {
        return count + 1
      }

      if (token.variant === rightType) {
        let newCount = count - 1

        if (newCount < 0) {
          throw UnmatchedParenthesesError()
        }
        return newCount
      }

      return count
    }, 0)

    if (count !== 0) {
      throw UnmatchedParenthesesError()
    }

    return true
  }
)

export const checkParenBalance = checkForBalance(
  TokenVariant.LEFT_PAREN,
  TokenVariant.RIGHT_PAREN
)

export const checkBracketBalance = checkForBalance(
  TokenVariant.LEFT_BRACKET,
  TokenVariant.RIGHT_BRACKET
)

function takeUntilMatch (
  leftType: TokenVariant,
  rightType: TokenVariant,
  tokens: Token[]
): [ Token[], Token[] ] {

  let subList: Token[] = []
  let rest: Token[] = []

  tokens.reduce((count: number, token: Token): number => {
    if (count === 0) {
      rest.push(token)
      return count
    }

    if (token.variant === rightType) {
      subList.push(token)
      return count - 1
    }

    if (token.variant === leftType) {
      subList.push(token)
      return count + 1
    }
    return count
  }, 1)

  return [ subList, rest ]
}

interface ASTNode {
  token: Token
  children: ASTNode[]
}

function buildAST (tokens: Token[]): ASTNode[] {
  const [ token ] = tokens

  if (
    token.variant === TokenVariant.LEFT_BRACKET ||
    token.variant === TokenVariant.LEFT_PAREN
  ) {
    const leftType = token.variant
    const rightType = token.variant === TokenVariant.LEFT_BRACKET ?
      TokenVariant.RIGHT_BRACKET : TokenVariant.RIGHT_PAREN

    const [tillLeft, rest] = takeUntilMatch(
      leftType,
      rightType,
      tokens.slice(1),
    )

    return [
      {
        token,
        children: buildAST(tillLeft)
      },
      ...buildAST(rest)
    ]
  }
  
  if (
    token.variant === TokenVariant.RIGHT_PAREN ||
    token.variant === TokenVariant.RIGHT_BRACKET
  ) {
    return []
  }

  return [
    {
      token,
      children: []
    },
    ...buildAST(tokens.slice(1))
  ]
}

export function parse(tokens: Token[]) {
  checkParenBalance(tokens)
  checkBracketBalance(tokens)

  return buildAST(tokens)
}
