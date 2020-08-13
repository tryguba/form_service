import { Constructor } from '../../reactive/constructor';
import { ValueDefinition } from '../definition/value.definition';
import { TypeRegistry } from '../registry/type.registry';
import { ObjectProperty, Target } from '../target';
import { AAssertion } from './assertion.abstract';
import { ValidationError } from '../errors/validation.error';
import { ParsingOptions, SerializationOptions } from './assertion.interface';

type _Object<T = any> = Record<string, T>;

export class ObjectAssertion extends AAssertion {
  properties: _Object<ValueDefinition | null>;
  target?: Constructor<_Object>;

  public constructor() {
    super();
    this.properties = {};
  }

  public getPropertyDefinition(name: string, registry: TypeRegistry): ValueDefinition | null | undefined {
    return this.properties[name];
  }

  public listDefinedProperties(registry: TypeRegistry): Iterable<string> {
    return Object.keys(this.properties);
  }

  public buildInstanceClass(): Constructor<_Object> {
    /// @todo implement
    return Object;
  }

  public get InstanceClass(): Constructor<_Object> {
    if (this.target === undefined) {
      this.target = this.buildInstanceClass();
    }
    return this.target;
  }

  public tryParse(target: Target, options: Readonly<ParsingOptions>): _Object | undefined {
    const { value } = target;
    if (Object.getPrototypeOf(value) === Object.prototype) {
      let cached = options.cache.find((item) => item.source === value && item.registry === options.registry && item.assertion === this);
      if (cached) {
        return cached.result;
      }
      const result: _Object = new (this.target || Object)();
      options.cache.push(cached = {
        assertion: this,
        registry: options.registry,
        source: value,
        result,
      });
      for (const propertyName of this.listDefinedProperties(options.registry)) {
        const definition = this.getPropertyDefinition(propertyName, options.registry);
        if (definition) {
          const parsedProperty = definition.parse(new ObjectProperty(value, propertyName, target), options);
          if (parsedProperty !== undefined) {
            result[propertyName] = parsedProperty;
          }
        }
      }
      return value;
    } else {
      return undefined;
    }
  }

  public trySerialize(target: Target, options: Readonly<SerializationOptions>): _Object | undefined {
    const {value} = target;
    if (value instanceof (this.InstanceClass)) {
      let cached = options.cache.find((item) => item.source === value && item.registry === options.registry && item.assertion === this);
      if (cached) {
        return cached.result;
      }
      const result: _Object = {};
      options.cache.push(cached = {
        assertion: this,
        registry: options.registry,
        source: value,
        result,
      });
      for (const propertyName of this.listDefinedProperties(options.registry)) {
        const definition = this.getPropertyDefinition(propertyName, options.registry);
        if (definition) {
          const serializedProperty = definition.serialize(new ObjectProperty(value, propertyName, target), options);
          if (serializedProperty !== undefined) {
            result[propertyName] = serializedProperty;
          }
        }
      }
      return value;
    } else {
      return undefined;
    }
  }

  public tryValidate(value: any, context: Map<object, any>): ValidationError | null | undefined {
    if (typeof value === 'object' && value && !Array.isArray(value)) {
      return null; /// @todo apply constraints
    } else {
      return undefined;
    }
  }

  public tryCopy(value: any, context: Map<object, any>): any {
  }

}
