import { Dependency } from './patterns/singleton/decorators/constructor-parameter/dependency';
import { Functional } from './patterns/singleton/decorators/constructor-parameter/functional';
import { Singleton } from './patterns/singleton/decorators/singleton';
import { SingletonStorage } from './patterns/singleton/singleton.storage';

@Singleton()
class A {
  public constructor() {
    console.log('A.constructor()');
  }

  someMethod(x: number) {
    return x * x;
  }
}

@Singleton()
class C {
  public constructor(@Functional(() => 10) private readonly _x: number, @Dependency() private readonly  _a: A) {
    console.log('C.constructor(), x=%o, a=%o', this._x, this._a);
  }

  someMethod() {
    return this._a.someMethod(this._x);
  }
}


const a = SingletonStorage.scope().set({
  someMethod(x: number): number {
    return x * x * x;
  },
}, A);

const c = SingletonStorage.scope().persist(C);
console.log(c.someMethod());
