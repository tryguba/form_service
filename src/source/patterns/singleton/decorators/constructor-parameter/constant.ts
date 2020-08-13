import { ConstantConstructorParameter } from '../../constructor-parameter';
import { getMetadataStorage } from '../../singleton.metadata.storage';


export function Constant<Type>(value: Type): ParameterDecorator & PropertyDecorator {
  return (target: Object, propertyKey?: string | symbol, parameterIndex?: number) => {
    if (typeof target === 'function' && propertyKey === undefined && typeof parameterIndex === 'number') { /// Constructor parameter decorator
      const storage = getMetadataStorage(target.prototype);
      storage.setConstructorArgument(parameterIndex, new ConstantConstructorParameter(value));
    } else if (propertyKey !== undefined && parameterIndex === undefined) { /// Property decorator
      const storage = getMetadataStorage(target);
      storage.setProperty(propertyKey, new ConstantConstructorParameter(value));
    } else {
      throw new Error('Illegal usage');
    }
  }
}
