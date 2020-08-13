import 'reflect-metadata';
import { DependencyConstructorParameter } from '../../constructor-parameter';
import { getMetadataStorage } from '../../singleton.metadata.storage';

export function Dependency(): ParameterDecorator & PropertyDecorator {
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex?: number) => {
    if (typeof target === 'function' && propertyKey === undefined && typeof parameterIndex === 'number') {
      /// Constructor parameter decorator
      const storage = getMetadataStorage(target.prototype);
      // console.log('cls', target.name, storage);
      const paramtypes = Reflect.getMetadata('design:paramtypes', target);

      storage.setConstructorArgument(parameterIndex, new DependencyConstructorParameter(paramtypes[parameterIndex]));
    } else if (propertyKey !== undefined && parameterIndex === undefined) {
      /// Property decorator
      const storage = getMetadataStorage(target);
      const type = Reflect.getMetadata('design:type', target, propertyKey);
      // console.log('prop', target.constructor.name, storage);
      // console.log('proptype', target.constructor.name, propertyKey, type);
      storage.setProperty(propertyKey, new DependencyConstructorParameter(type));
    } else {
      throw new Error('Illegal usage');
    }
  };
}
