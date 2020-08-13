import { ValueDefinition } from '../definition/value.definition';
import { ArrayElement, Target } from '../target';
import { AAssertion } from './assertion.abstract';
import { ValidationError } from '../errors/validation.error';
import { ParsingOptions, SerializationOptions } from './assertion.interface';

export class TupleAssertion extends AAssertion {
  items: Array<ValueDefinition>;

  public constructor() {
    super();
  }

  public tryParse(target: Target, options: Readonly<ParsingOptions>): any {
    const { value } = target;
    if (value instanceof Array) {
      let cached = options.cache.find((item) => item.source === value && item.registry === options.registry && item.assertion === this);
      if (cached) {
        return cached.result;
      }
      const result: any[] = [];
      options.cache.push(cached = {
        assertion: this,
        registry: options.registry,
        source: value,
        result,
      });
      const length = this.items.length;
      for (let index = 0; index !== length; ++index) {
        result.push(this.items[index].parse(new ArrayElement(value, index, target), options));
      }
      return value;
    } else {
      return undefined;
    }
  }

  public trySerialize(target: Target, options: Readonly<SerializationOptions>): any {
    const { value } = target;
    if (value instanceof Array) {
      let cached = options.cache.find((item) => item.source === value && item.registry === options.registry && item.assertion === this);
      if (cached) {
        return cached.result;
      }
      const result: any[] = [];
      options.cache.push(cached = {
        assertion: this,
        registry: options.registry,
        source: value,
        result,
      });
      const length = this.items.length;
      for (let index = 0; index !== length; ++index) {
        result.push(this.items[index].serialize(new ArrayElement(value, index, target), options));
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
