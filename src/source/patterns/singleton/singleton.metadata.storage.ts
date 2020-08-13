import 'reflect-metadata';
import dbg from 'debug';
import { Constructor } from '../../reactive/constructor';

import { ConstructorParameter } from './constructor-parameter';
import { SingletonStorage } from './singleton.storage';

const debug = dbg('singleton/metadata-storage');
const STORAGE_KEY = Symbol('singleton:storage');
const _registry = new Set<Constructor>();

export interface SingletonMetadataStorage {
  readonly constructorArguments: ReadonlyArray<ConstructorParameter<SingletonStorage, any> | undefined>;
  readonly properties: ReadonlyArray<[string | symbol, ConstructorParameter<SingletonStorage, any>]>;

  setConstructorArgument(index: number, parameter: ConstructorParameter<SingletonStorage, any>): void;
  setProperty(name: string | symbol, parameter: ConstructorParameter<SingletonStorage, any>): void;
}

class _SingletonMetadataStorage implements SingletonMetadataStorage {
  public readonly constructorArguments: Array<ConstructorParameter<SingletonStorage, any> | undefined>;
  public readonly properties: [string | symbol, ConstructorParameter<SingletonStorage, any>][];

  public constructor() {
    this.constructorArguments = [];
    this.properties = [];
  }

  public setConstructorArgument(index: number, parameter: ConstructorParameter<SingletonStorage, any>): void {
    while (this.constructorArguments.length <= index) {
      this.constructorArguments.push(undefined);
    }
    this.constructorArguments[index] = parameter;
  }

  public setProperty(name: string | symbol, parameter: ConstructorParameter<SingletonStorage, any>): void {
    this.properties.push([name, parameter]);
  }
}

function _createEmptyMetadata(): SingletonMetadataStorage {
  return new _SingletonMetadataStorage();
}

export function getMetadataStorage(prototype: Object): SingletonMetadataStorage {
  let storage: SingletonMetadataStorage | undefined = Reflect.getOwnMetadata(STORAGE_KEY, prototype);
  if (!storage) {
    Reflect.defineMetadata(STORAGE_KEY, (storage = _createEmptyMetadata()), prototype);
    debug('META %s', prototype.constructor.name);
  }
  return storage;
}

export function tryGetMetadataStorage(prototype: Object): SingletonMetadataStorage | undefined {
  return Reflect.getOwnMetadata(STORAGE_KEY, prototype);
}

export function registerType(cls: Constructor): void {
  _registry.add(cls);
}
