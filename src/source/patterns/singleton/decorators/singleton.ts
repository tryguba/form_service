import { Constructor } from '../../../reactive/constructor';
import { ConstructorParameter, ReflectHelpers } from '../../../helpers/reflect';
import { getMetadataStorage, registerType } from '../singleton.metadata.storage';
import { Dependency } from './constructor-parameter/dependency';

export interface SingletonOptions {
  defaultArgument?: ParameterDecorator;
}

function _register(target: Function, defaultArgument: ParameterDecorator) {
  const storage = getMetadataStorage(target.prototype);
  const params: any[] = Reflect.getMetadata('design:paramtypes', target) || storage.constructorArguments;

  const persistArgument: ParameterDecorator = (target, propertyKey, parameterIndex) => {
    if (storage.constructorArguments[parameterIndex] === undefined) {
      defaultArgument(target, propertyKey, parameterIndex);
    }
  };

  registerType((target as Function) as Constructor);
  return ReflectHelpers.decorate(
    params.map((type, index) => ConstructorParameter(index, persistArgument)),
    target,
  );
}

export function Singleton(options?: SingletonOptions): ClassDecorator {
  const { defaultArgument = Dependency() } = options || {};
  return (target) => {
    _register(target, defaultArgument);
  };
}

Singleton.register = function <Instance>(target: Constructor<Instance>, options?: SingletonOptions) {
  const { defaultArgument = Dependency() } = options || {};
  _register(target, defaultArgument);
};
