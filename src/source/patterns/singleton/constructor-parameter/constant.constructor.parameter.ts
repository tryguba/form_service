import { ConstructorParameter } from './constructor.parameter';


export class ConstantConstructorParameter<Type> implements ConstructorParameter<any, Type> {
  public readonly value: Type;
  public constructor(value: Type) {
    this.value = value;
  }

  public resolve(context: any): Type {
    return this.value;
  }
}

