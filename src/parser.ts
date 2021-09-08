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

export function takeUntilMatch(
  leftType: TokenVariant,
  rightType: TokenVariant,
  tokens: Token[]
): [Token[], Token[]] {
  let subList: Token[] = []
  let rest: Token[] = []

  tokens.reduce((count: number, token: Token): number => {
    if (count === 0) {
      rest.push(token)
      return count
    }

    if (token.variant === rightType) {
      if (count - 1 !== 0) {
        subList.push(token)
      }
      return count - 1
    }

    if (token.variant === leftType) {
      subList.push(token)
      return count + 1
    }

    subList.push(token)
    return count
  }, 1)

  return [subList, rest]
}

interface ASTNode {
  token: Token
}

type AST = Array<ASTNode | AST>

export function prettyPrint(tree: AST, indent = 0): string {
  let padding = " ".repeat(indent)
  let lines = tree.map(
    (node: ASTNode | AST) => {
      if (Array.isArray(node)) {
        return `${padding}[\n` + prettyPrint(node, indent + 2) + `${padding}]\n`
      } else {
        const token = node.token

        if (token.hasValue()) {
          const value = token.value
          return `${padding}<${node.token.variant} value=${value}>\n`
        } else {
          return `${padding}<${node.token.variant}>\n`
        }
      }
    }
  )

  return lines.join("")
}

export function buildAST(tokens: Token[]): AST {
  if (tokens.length === 0) {
    return []
  }

  const [token] = tokens

  if (
    token.variant === TokenVariant.LEFT_BRACKET ||
    token.variant === TokenVariant.LEFT_PAREN
  ) {
    const leftType = token.variant
    const rightType =
      token.variant === TokenVariant.LEFT_BRACKET
        ? TokenVariant.RIGHT_BRACKET
        : TokenVariant.RIGHT_PAREN

    const [tillLeft, rest] = takeUntilMatch(
      leftType,
      rightType,
      tokens.slice(1)
    )

    return [
      buildAST(tillLeft),
      ...buildAST(rest),
    ]
  }

  if (
    token.variant === TokenVariant.RIGHT_PAREN ||
    token.variant === TokenVariant.RIGHT_BRACKET
  ) {
    return [
    ]
  }

  return [
    {
      token,
    },
    ...buildAST(tokens.slice(1)),
  ]
}

export function parse(tokens: Token[]) {
  checkParenBalance(tokens)
  checkBracketBalance(tokens)

  return buildAST(tokens)
}
