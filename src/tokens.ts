// This module defines the tokens in our lisp dialect

/**
 * Enum holding strings for the possible token variants
 */
export enum TokenVariant {
  // PUNCTUATION
  LEFT_PAREN = "LEFT_PAREN",
  RIGHT_PAREN = "RIGHT_PAREN",
  LEFT_BRACKET = "LEFT_BRACKET",
  RIGHT_BRACKET = "RIGHT_BRACKET",
  COMMA = "COMMA",

  // VALUES
  NUM_LITERAL = "NUM_LITERAL",
  STRING_LITERAL = "STRING_LITERAL",
  IDENTIFIER = "IDENTIFIER",

  // OPERATORS
  ADD = "ADD",
  DIVIDE = "DIVIDE",
}

interface IToken {
  variant: TokenVariant,
}

interface TokenBuilder {
  (val: string | number): StringLiteral | Identifier | NumLiteral
  // (n: number): NumLiteral
  (): LeftParen | RightParen | LeftBracket | RightBracket | Comma | AdditionOperator | DivisionOperator
}

export interface LeftParen extends IToken {
  variant: TokenVariant.LEFT_PAREN
}
export const leftParen = (): LeftParen => ({ variant: TokenVariant.LEFT_PAREN })

export interface RightParen extends IToken {
  variant: TokenVariant.RIGHT_PAREN
}
export const rightParen = (): RightParen => ({ variant: TokenVariant.RIGHT_PAREN })

export interface LeftBracket extends IToken {
  variant: TokenVariant.LEFT_BRACKET
}
export const leftBracket = (): LeftBracket => ({ variant: TokenVariant.LEFT_BRACKET })

export interface RightBracket extends IToken {
  variant: TokenVariant.RIGHT_BRACKET
}
export const rightBracket = (): RightBracket => ({ variant: TokenVariant.RIGHT_BRACKET })

export interface Comma extends IToken {
  variant: TokenVariant.COMMA
}
export const comma = (): Comma => ({ variant: TokenVariant.COMMA })

export interface NumLiteral extends IToken {
  variant: TokenVariant.NUM_LITERAL
  value: number
}
export const numLiteral = (n: number): NumLiteral => ({
  variant: TokenVariant.NUM_LITERAL,
  value: n
})

export interface StringLiteral extends IToken {
  variant: TokenVariant.STRING_LITERAL
  value: string
}
export const stringLiteral = (str: string): StringLiteral => ({
  variant: TokenVariant.STRING_LITERAL,
  value: str
})

export interface Identifier extends IToken {
  variant: TokenVariant.IDENTIFIER
  value: string
}
export const identifier = (id: string): Identifier => ({
  variant: TokenVariant.IDENTIFIER,
  value: id
})

export interface AdditionOperator extends IToken {
  variant: TokenVariant.ADD
}
export const additionOperator = (): AdditionOperator => ({
  variant: TokenVariant.ADD
})

export interface DivisionOperator extends IToken {
  variant: TokenVariant.DIVIDE
}
export const divisionOperator = (): DivideOperator => ({
  variant: TokenVariant.DIVIDE
})


// abstract class AbstractToken {
//   /**
//    * String enum to discriminate between the variants in our union type.
//    */
//   static variant: TokenVariant

//   /**
//    * Does this token hold a value or not?
//    *
//    * A token like a parantheses or a bracket holds no value, it is
//    * merely there or not. But a number literal can have many values!
//    */
//   abstract get hasValue(): boolean

//   /**
//    * The regular expression for matching string literals for this token.
//    */
//   static regex: RegExp
// }

// abstract class NonValueToken extends AbstractToken {
//   get hasValue() {
//     return false
//   }
// }

// abstract class ValueToken<T> extends AbstractToken {
//   constructor(match: RegExpMatchArray) {
//     super()
//     this.value = this.parseValue(match)
//   }

//   get hasValue() {
//     return true
//   }

//   /**
//    * For tokens that hold a value, we have to parse that value our
//    * of the match somehow!
//    */
//   abstract parseValue(match: string): T

//   value: T
// }

// // PUNCTUATION TOKENS
// export class LeftParen extends NonValueToken {
//   static variant = TokenVariant.LEFT_PAREN
//   static regex = /^\(/
// }

// export class RightParen extends NonValueToken {
//   static variant = TokenVariant.RIGHT_PAREN
//   static regex = /^\)/
// }

// export class LeftBracket extends NonValueToken {
//   static variant = TokenVariant.LEFT_BRACKET
//   static regex = /^\[/
// }

// export class RightBracket extends NonValueToken {
//   static variant = TokenVariant.RIGHT_BRACKET
//   static regex = /^\]/
// }

// export class Comma extends NonValueToken {
//   static variant = TokenVariant.COMMA
//   static regex = /^\,/
// }

// // VALUE-HOLDING TOKENS
// // ====================
// // our tokens which can take on a particular value

// /**
//  * NumLiteral is going to be interpreted as a JavaScript Number,
//  * so it can be a float or an integer (messy!)
//  */
// export class NumLiteral extends ValueToken<number> {
//   static variant = TokenVariant.NUM_LITERAL

//   parseValue(match: string) {
//     return parseInt(match)
//   }

//   static regex = /^\d+/
// }

// export class StringLiteral extends ValueToken<string> {
//   static variant = TokenVariant.STRING_LITERAL

//   parseValue(match: string) {
//     return match.replace(/^"/, "").replace(/"$/, "")
//   }
//   static regex = /^".*"/
// }

// export class Identifier extends ValueToken<string> {
//   static variant = TokenVariant.IDENTIFIER

//   parseValue(match: string) {
//     return match
//   }

//   static regex = /^[A-Za-z]+/
// }

// // OPERATORS
// export class AdditionOperator extends NonValueToken {
//   static variant = TokenVariant.ADD
//   static regex = /^\+/
// }

// export class DivideOperator extends NonValueToken {
//   static variant = TokenVariant.DIVIDE
//   static regex = /^\//
// }

export type Token =
  | LeftParen
  | RightParen
  | LeftBracket
  | RightBracket
  | Comma
  | NumLiteral
  | StringLiteral
  | Identifier
  | AdditionOperator
  | DivisionOperator

type TokenBuilder =
  | (() => LeftParen | RightParen | LeftBracket | RightBracket)
| ((n: number) => Token)
| ((str: string) => Token)

  export const TOKEN_MANIFEST: [TokenBuilder, RegExp][] = [
  [leftParen, /^\(/],
  [rightParen,/^\)/ ],
  [leftBracket,/^\[/], 
  [rightBracket,/^\]/],
  [comma,/^\,/],
  [numLiteral,/^\d+/],
  [stringLiteral,/^".*"/],
  [identifier,/^[A-Za-z]+/],
  [additionOperator,/^\+/],
  [divisionOperator, /^\//]
]
