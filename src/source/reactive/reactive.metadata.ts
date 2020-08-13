import 'reflect-metadata';
import { Constructor } from './constructor';
import {PropertyDecorator} from './better.types';

export interface ReactivePropertyMetadata<T> {
  type: Constructor | undefined;
  readOnly: boolean;
  initial(): T;
}

type ReactivePropertiesMetadata<T> = {
  [key in keyof T]?: ReactivePropertyMetadata<T[key]>;
}

export interface ReactiveMetadata<Target> {
  properties: ReactivePropertiesMetadata<Target>;
}

const META_KEY = Symbol();
export function persistReactiveMetadata<Target>(target: Target): ReactiveMetadata<Target> {
  let metadata = Reflect.getOwnMetadata(META_KEY, target) as ReactiveMetadata<Target> | undefined;
  if (!metadata) {
    const prototype = Object.getPrototypeOf(target);
    if (prototype !== null) {
      const prototypeMetadata = persistReactiveMetadata(prototype);
      metadata = {
        properties: Object.create(prototypeMetadata.properties),
      };
    } else {
      metadata = {
        properties: Object.create(null),
      };
    }
    Reflect.defineMetadata(META_KEY, metadata, target);
  }
  return metadata;
}

export function getReactiveMetadata<Target>(target: Target): ReactiveMetadata<Target> | undefined {
  return Reflect.getMetadata(META_KEY, target);
}

export interface ReactivePropertyOptions {
  type: Constructor;
  readOnly: boolean;
  initial(): any;
}



export function ReactiveProperty(options: Readonly<Partial<ReactivePropertyOptions>> = {}): PropertyDecorator {
  const {
    type,
    readOnly = false,
    initial = () => undefined
  } = options;
  return (target, propertyKey) => {
    const metadata = persistReactiveMetadata(target);
    metadata.properties[propertyKey] = {
      type: type || Reflect.getMetadata('design:type', target, propertyKey),
      readOnly,
      initial
    };
  };
}

// class A {
//   @ReactiveProperty({
//     readOnly: true,
//     initial(): any {
//       return 10;
//     },
//   })
//   public x: number;
//
//   @ReactiveProperty({
//     initial(): any {
//       return '';
//     },
//   })
//   public y: string;
// }
//
// class B extends A {
//   @ReactiveProperty({
//     initial(): any {
//       return false;
//     },
//   })
//   public z: boolean;
// }
//
// const b = new B();
// const meta = getReactiveMetadata(b);
// if (meta) {
//   for (const prop in meta.properties) {
//     console.log('%o => %o', prop, meta.properties[prop as keyof B]);
//   }
// }




