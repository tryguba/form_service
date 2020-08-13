import { SingletonStorage } from '../singleton.storage';
import { ConstructorParameter } from './constructor.parameter';


export class ScopeNameConstructorParameter implements ConstructorParameter<SingletonStorage, string | undefined> {
  public resolve(context: SingletonStorage): string | undefined {
    return context.scope;
  }
}
