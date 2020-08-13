import { Constructor } from '../../reactive/constructor';
import { includes } from '../../helpers/itertools';
import { ArrayStack } from '../../helpers/stack';
import { getMetadataStorage, SingletonMetadataStorage, tryGetMetadataStorage } from './singleton.metadata.storage';
import {Stack} from "../../helpers/stack/stack";

const _scopes: Map<string | undefined, SingletonStorage> = new Map();

enum INSTANCE_STATE {
  CONSTRUCTION = 'construction',
  CREATED = 'created',
  BUILT = 'built',

  FAILURE = 'failure',
}

interface InstanceInfo<T extends Object = Object> {
  value?: T;
  error?: Error;
  meta: SingletonMetadataStorage;
  state: INSTANCE_STATE;
  strictDependencies: Set<Function>;
  directDependencies: Set<Function>;
}

function _createArgFactory(meta: SingletonMetadataStorage): (storage: SingletonStorage) => any[] {
  return (storage) => {
    return meta.constructorArguments.map((arg) => {
      if (!arg) {
        throw new Error('Undefined argument');
      }
      return arg.resolve(storage);
    });
  };
}

export class SingletonStorage {
  public readonly scope?: string;

  public static scope(name?: string): SingletonStorage {
    let storage = _scopes.get(name);
    if (!storage) {
      _scopes.set(name, (storage = new SingletonStorage(name)));
    }
    return storage;
  }

  private constructor(name?: string) {
    // if (_scopes.has(name)) {
    //   throw new Error(`Illegal usage. Storage for scope ${JSON.stringify(name)} already exists`);
    // }
    this.scope = name;
    this._registry = new Map();
    this._stack = new ArrayStack();
  }

  public get<Type extends Object>(constructor: Constructor<Type>): Type | undefined {
    const data = this._registry.get(constructor);
    return data ? (data.value as Type) : undefined;
  }

  public set<Type extends Object>(instance: Type, as?: Constructor<Type>): void {
    const ctor = as || instance.constructor;
    this._registry.set(ctor, {
      state: INSTANCE_STATE.BUILT,
      value: instance,
      meta: getMetadataStorage(ctor.prototype),
      directDependencies: new Set(),
      strictDependencies: new Set(),
    });
  }

  public create<Type extends Object, Args extends any[]>(constructor: Constructor<Type, Args>, ...args: Args): Type {
    return this.persist(constructor, () => args);
  }

  public persist<Type extends Object>(constructor: Constructor<Type>): Type;
  public persist<Type extends Object, Args extends any[]>(
    constructor: Constructor<Type, Args>,
    argsFactory: (storage: SingletonStorage) => Args,
  ): Type;
  // public persist<Cls extends Constructor>(constructor: Cls, argsFactory: (storage: SingletonStorage) => Cls extends Constructor<any, infer A> ? A : never): Cls extends Constructor<infer T> ? T : never;
  public persist<Type extends Object>(
    constructor: Constructor<Type>,
    argsFactory?: (storage: SingletonStorage) => any[],
  ): Type {
    let instance = this.get(constructor);
    if (!instance) {
      const info = argsFactory ? this._create(constructor, argsFactory) : this._create(constructor);
      if (info.state == INSTANCE_STATE.CREATED && info.value) {
        instance = info.value;
      } else {
        throw new Error('Shit happens');
      }
      if (this._stack.empty) {
        this._build();
      }
    }
    return instance;
  }

  private _create<Type extends Object>(constructor: Constructor<Type>): InstanceInfo<Type>;
  private _create<Type extends Object, Args extends any[]>(
    constructor: Constructor<Type, Args>,
    argsFactory: (storage: SingletonStorage) => Args,
  ): InstanceInfo<Type>;
  private _create<Type extends Object>(
    constructor: Constructor<Type>,
    argsFactory?: (storage: SingletonStorage) => any[],
  ): InstanceInfo<Type> {
    if (includes(this._stack, constructor)) {
      throw new Error('Dependency recursion on ' + constructor.name);
    }
    const meta = tryGetMetadataStorage(constructor.prototype);
    // console.log('META', constructor.name, meta);
    if (!meta) {
      // console.log('No metadata found for', constructor.name);
      throw new Error('No metadata found for ' + constructor.name);
    }
    for (const cls of this._stack) {
      const info = this._registry.get(cls)!;
      info.strictDependencies.add(constructor);
    }
    const top = this._stack.top;
    if (top) {
      const info = this._registry.get(top)!;
      info.directDependencies.add(constructor);
    }
    const info: InstanceInfo<Type> = {
      value: undefined,
      meta,
      state: INSTANCE_STATE.CONSTRUCTION,
      directDependencies: new Set(),
      strictDependencies: new Set(),
    };
    this._registry.set(constructor, info);
    this._stack.push(constructor);
    try {
      if (typeof argsFactory !== 'function') {
        argsFactory = _createArgFactory(meta);
      }
      info.value = new constructor(...argsFactory(this));
      info.state = INSTANCE_STATE.CREATED;
      if (this._stack.top !== constructor) {
        throw new Error('Invalid stack usage');
      }
      this._stack.pop();
      return info;
    } catch (e) {
      info.state = INSTANCE_STATE.FAILURE;
      info.error = e;
      throw e;
    }
  }

  private _build() {
    for (const info of this._registry.values()) {
      if (info.state === INSTANCE_STATE.CREATED && info.value) {
        try {
          for (const [name, builder] of info.meta.properties) {
            (info.value as any)[name] = builder.resolve(this);
          }
          info.state = INSTANCE_STATE.BUILT;
        } catch (e) {
          info.error = e;
          info.state = INSTANCE_STATE.FAILURE;
          throw e;
        }
      }
    }
  }

  private readonly _registry: Map<Function, InstanceInfo>;
  private readonly _stack: Stack<Constructor>;
}
