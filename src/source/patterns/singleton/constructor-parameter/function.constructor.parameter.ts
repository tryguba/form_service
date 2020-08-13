import { ConstructorParameter } from './constructor.parameter';


export class FunctionConstructorParameter<ContextType = any, Type = any> implements ConstructorParameter<ContextType, Type> {
  public readonly resolve: (context: ContextType) => Type;
  public constructor(resolve: (context: ContextType) => Type) {
    this.resolve = resolve;
  }
}
