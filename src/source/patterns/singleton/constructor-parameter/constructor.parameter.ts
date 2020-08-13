export interface ConstructorParameter<ContextType = any, ValueType = any> {
  resolve(context: ContextType): ValueType;
}
