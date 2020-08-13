import { Constructor } from '../../../reactive/constructor';
import { SingletonStorage } from '../singleton.storage';
import { ConstructorParameter } from './constructor.parameter';

export class DependencyConstructorParameter<Type> implements ConstructorParameter<SingletonStorage, Type> {
  public readonly cls: Constructor<Type>;
  public constructor(cls: Constructor<Type>) {
    this.cls = cls;
  }

  public resolve(context: SingletonStorage): Type {
    return context.persist(this.cls);
  }
}
