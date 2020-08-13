import { Cloneable } from '../../helpers/interfaces/cloneable';
import { Comparable } from '../../helpers/interfaces/comparable';
import { Constraint } from '../constraint/constraint.interface';
import { ValidationError } from '../errors/validation.error';
import { TypeRegistry } from '../registry/type.registry';
import { Target } from '../target';

export interface ParsingCacheItem {
  source: object;
  assertion: Assertion;
  registry: TypeRegistry;
  result: any;
}

export interface ParsingOptions {
  cache: Array<Readonly<ParsingCacheItem>>;
  registry: TypeRegistry;
}

export interface SerializationCacheItem {
  source: object;
  assertion: Assertion;
  registry: TypeRegistry;
  result: any;
}

export interface SerializationOptions {
  cache: Array<Readonly<SerializationCacheItem>>;
  registry: TypeRegistry;
}

export interface Assertion extends Comparable {
  constraints: Constraint[];

  tryParse(target: Target, options: Readonly<ParsingOptions>): any;
  // parse(value: any, options: Readonly<ParsingOptions>): any;

  trySerialize(target: Target, options: Readonly<SerializationOptions>): any;
  // serialize(value: any, options: Readonly<SerializationOptions>): any;
}
