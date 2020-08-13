import { Constructor } from '../reactive/constructor';

interface MethodInfo<Args extends any[] = any[], Result = any, Method extends (...args: Args) => Result = (...args: Args) => Result> {
  args: Args;
  result: Result;
  method: Method;
}

type Methods<Instance extends Object> = {
  [key in keyof Instance]: Instance[key] extends (...args: infer A) => infer R ? MethodInfo<A, R, Instance[key]> : unknown;
};

interface BuildRule<Instance> {
  run(instance: Instance): void;
}

class ExecuteRule<Instance> implements BuildRule<Instance>  {
  public constructor(private readonly _executor: (instance: Instance) => void) {}

  public run(instance: Instance) {
    this._executor(instance);
  }
}

class CallMethodRule<Instance> implements BuildRule<Instance> {
  public constructor(private readonly _method: any, private readonly _args: any[]) {}

  public run(instance: Instance) {
    const method = (instance as any)[this._method];
    if (typeof method !== 'function') {
      throw new Error('Illegal usage!');
    }
    method.apply(instance, this._args);
  }
}

class SetPropertyRule<Instance> implements BuildRule<Instance> {
  public constructor(private readonly _property: any, private readonly _value: any) {
  }

  public run(instance: Instance) {
    (instance as any)[this._property] = this._value;
  }
}

export class ObjectBuilder<Ctor extends Constructor, Instance extends InstanceType<Ctor> = InstanceType<Ctor>> {
  private readonly _ctor: Ctor;
  private readonly _rules: BuildRule<Instance>[];
  public constructor(ctor: Ctor) {
    this._ctor = ctor;
    this._rules = [];
  }

  build(...args: Ctor extends Constructor<any, infer A> ? A : unknown[]): Instance {
    const instance = new (this._ctor)(...args);
    for (const rule of this._rules) {
      rule.run(instance);
    }
    return instance;
  }

  execute(executor: (instance: Instance) => void): this {
    this._rules.push(new ExecuteRule(executor));
    return this;
  }
  
  call<Method extends keyof Instance>(method: Method, ...args: Methods<Instance>[Method] extends MethodInfo ? Methods<Instance>[Method]['args'] : unknown[]): this {
    this._rules.push(new CallMethodRule(method, args));
    return this;
  }

  set<Property extends keyof Instance>(property: Property, value: Instance[Property]): this {
    this._rules.push(new SetPropertyRule(property, value));
    return this;
  }
}
