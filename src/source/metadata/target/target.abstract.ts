export interface Target<ValueType = any> {
  readonly value: ValueType;

  readonly relativePath: string | number;
  readonly absolutePath: ReadonlyArray<string | number>;
  readonly parent?: Target;
}

export abstract class ATarget<ValueType = any> implements Target<ValueType> {
  readonly value: ValueType;

  readonly relativePath: string | number;
  readonly absolutePath: ReadonlyArray<string | number>;
  readonly parent?: ATarget;

  protected constructor(value: ValueType, relativePath: string | number, parent?: ATarget) {
    this.value = value;
    this.relativePath = relativePath;
    this.parent = parent;
    this.absolutePath = Object.freeze(parent ? [...parent.absolutePath, relativePath] : [relativePath]);
  }
}

