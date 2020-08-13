export class ClonedContext {
  private readonly _stored: Map<object, object>;

  public static create(): ClonedContext {
    return new ClonedContext();
  }

  public constructor() {
    this._stored = new Map();
  }

  public get<T extends object>(source: T): T | undefined {
    return this._stored.get(source) as (T | undefined);
  }

  public store<T extends object>(source: T, value: T): void {
    this._stored.set(source, value);
  }

  public delete<T extends object>(source: T): void {
    this._stored.delete(source);
  }
}

export interface Cloneable {
  clone(ctx?: ClonedContext): this;
}
