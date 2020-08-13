import { Assertion, ParsingOptions, SerializationOptions } from '../assertion';
import { Target } from '../target';

export class ValueDefinition {
  title?: string;
  description?: string;
  required: boolean;
  assert: Assertion[];

  parse(target: Target, options: Readonly<ParsingOptions>): any {
    return;
  }
  serialize(target: Target, options: Readonly<SerializationOptions>): any {
    return;
  }
}
