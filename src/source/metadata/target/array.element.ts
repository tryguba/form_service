import { ATarget } from './target.abstract';

export class ArrayElement<ArrayType extends any[], IndexType extends (keyof ArrayType & number) = (keyof ArrayType & number)> extends ATarget<ArrayType[IndexType]> {
  public readonly relativePath: IndexType;
  public constructor(object: ArrayType, index: IndexType, parent?: ATarget) {
    super(object[index], index, parent);
  }

  public get index(): IndexType {
    return this.relativePath;
  }
}
