export const EQUALS_TO_METHOD = Symbol.for('method:equals-to');

export interface Comparable {
  [EQUALS_TO_METHOD](another: this): boolean;
}

export function isComparable<T extends object>(value: T): value is T & Comparable {
  return typeof (value as any)[EQUALS_TO_METHOD] === 'function';
}
