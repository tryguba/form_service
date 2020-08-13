import 'reflect-metadata';
import { TransformOptions } from 'class-transformer/metadata/ExposeExcludeOptions';
import { EventEmitter } from 'events';
import { Transform } from 'class-transformer';


const _container = new WeakMap<object, {}>();

function getInternal(target: object): {} {
  let result = _container.get(target);
  if (!result) {
    _container.set(target, result = {});
  }
  return result;
}

function TrackedProperty(): PropertyDecorator {
  return (target, propertyKey) => {
    if (typeof propertyKey !== 'string') {
      return ;
    }
    if (!(target instanceof EventEmitter)) {
      throw new Error('IDU NAHUY');
    }
    console.log('TrackedProperty %s.%s: %o', target.constructor.name, propertyKey, Reflect.getMetadata('design:type', target, propertyKey));
    return {
      get: function (this: EventEmitter) {
        return (getInternal(target) as any)[propertyKey];
      },
      set: function (this: EventEmitter, value: any) {
        const internal = getInternal(target);
        const old = (internal as any)[propertyKey];
        if (old !== value) {
          (internal as any)[propertyKey] = value;
          this.emit(`${propertyKey}Changed`, value, old);
          // console.log('Property %o changed from %o to %o', propertyKey, old, value);
        }
      },
      configurable: false,
      enumerable: true,
    };
  }
}

class Test extends EventEmitter {
  @TrackedProperty()
  public a: number;

  @TrackedProperty()
  public b: string;
}

const t = new Test();

t.on('aChanged', (value: number, prev?: number) => {
  console.log('a changed from %o to %o', prev, value);
});

t.on('bChanged', (value: string, prev?: string) => {
  console.log('b changed from %o to %o', prev, value);
});

t.a = 10;
t.b = 'hello';
t.a = 10;
t.b = 'hello';
t.a = 20;
t.b = 'hello111';


type MappingItem<Source, Target> = {
  source: Source;
  target: Target;
};

type Mapping<Source, Target> = ReadonlyArray<MappingItem<Source, Target>>;

function MapTransform(mapping: Mapping<any, any>, options?: TransformOptions): PropertyDecorator {
  return (target, propertyKey) => {
    return Transform((value) => {
      const found = mapping.find((item) => item.source === value);
      return found ? found.target : value;
    }, options)(target, propertyKey as string);
  }
}

function UnmapTransform(mapping: Mapping<any, any>, options?: TransformOptions): PropertyDecorator {
  return (target, propertyKey) => {
    return Transform((value) => {
      const found = mapping.find((item) => item.target === value);
      return found ? found.source : value;
    }, options)(target, propertyKey as string);
  }
}

const BooleanIntegerMapping: Mapping<boolean, number> = [
  {
    source: false,
    target: 0,
  },
  {
    source: true,
    target: 1,
  }
];

function BooleanToInteger(options?: TransformOptions): PropertyDecorator {
  return MapTransform(BooleanIntegerMapping, options);
}

function IntegerToBoolean(options?: TransformOptions): PropertyDecorator {
  return UnmapTransform(BooleanIntegerMapping, options);
}
