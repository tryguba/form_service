type TypedFunction<Args extends any[], Result> = (...args: Args) => Result;

export function any<ValueType>(operator: TypedFunction<[ValueType], boolean>, values: Iterable<ValueType>): boolean {
  for (const value of values) {
    if (operator(value)) {
      return true;
    }
  }
  return false;
}

export function find<ValueType>(operator: TypedFunction<[ValueType], boolean>, values: Iterable<ValueType>): ValueType | undefined {
  for (const value of values) {
    if (operator(value)) {
      return value;
    }
  }
  return;
}

export function includes<ValueType>(values: Iterable<ValueType>, sample: ValueType): boolean {
  return any((value) => value === sample, values);
}
