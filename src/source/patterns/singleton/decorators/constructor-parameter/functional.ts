import { ConstantConstructorParameter, FunctionConstructorParameter } from '../../constructor-parameter';
import { getMetadataStorage } from '../../singleton.metadata.storage';
import { SingletonStorage } from '../../singleton.storage';

export function Functional<Type>(operator: (storage: SingletonStorage) => Type): ParameterDecorator & PropertyDecorator {
  return (target: Object, propertyKey?: string | symbol, parameterIndex?: number) => {
    if (typeof target === 'function' && propertyKey === undefined && typeof parameterIndex === 'number') { /// Constructor parameter decorator
      const storage = getMetadataStorage(target.prototype);
      storage.setConstructorArgument(parameterIndex, new FunctionConstructorParameter(operator));
    } else if (propertyKey !== undefined && parameterIndex === undefined) { /// Property decorator
      const storage = getMetadataStorage(target);
      storage.setProperty(propertyKey, new FunctionConstructorParameter(operator));
    } else {
      throw new Error('Illegal usage');
    }
  }
}
