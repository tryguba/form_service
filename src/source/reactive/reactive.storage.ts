import { getReactiveMetadata } from './reactive.metadata';
import { SafeEmitter } from './safe.emitter';
import { TypedEmitter } from './typed.emitter';
import { weakCached } from './weak.cached';

type ChangeEventMap<Values> = {
  [key in keyof Values]: [Values[key], Values[key]];
};

const persistStorage = weakCached((target: object): ReactiveStorage<{}> => {
  return new ReactiveStorage<{}>(target);
});

export class ReactiveStorage<Values extends {}> {
  public static persist<T extends {}>(target: T): ReactiveStorage<T> {
    return persistStorage(target) as any as ReactiveStorage<T>;
  }


  private readonly _values: Values;
  public readonly emitter: TypedEmitter<ChangeEventMap<Values>>;
  public readonly properties: ReadonlyArray<keyof Values & string>;

  public constructor(target: Values) {
    this.emitter = new SafeEmitter() as TypedEmitter<ChangeEventMap<Values>>;
    this._values = {} as Values;
    const metadata = getReactiveMetadata(target);
    const properties: Array<keyof Values & string> = [];
    this.properties = properties;
    if (metadata) {
      for (const name in metadata.properties) {
        properties.push(name);
        const prop = metadata.properties[name as keyof Values];
        if (prop) {
          this._values[name as keyof Values] = prop.initial();
        }
      }
    }
    // Object.freeze(this.properties);
  }

  public update<Key extends keyof Values & string>(key: Key, value: Values[Key]) {
    const prev = this._values[key];
    if (!Object.is(prev, value)) {
      this._values[key] = value;
      this.emitter.emit(key, value, prev);
    }
  }

  public get<Key extends keyof Values & string>(key: Key): Values[Key] {
    return this._values[key];
  }
}
