import { Constructor } from '../../reactive/constructor';
import { equals } from '../../helpers/equal';
import { ClonedContext } from '../../helpers/interfaces/cloneable';
import { EQUALS_TO_METHOD } from '../../helpers/interfaces/comparable';
import { Constraint } from '../constraint/constraint.interface';
import { Target } from '../target';
import { Assertion, ParsingOptions, SerializationOptions } from './assertion.interface';


export abstract class AAssertion implements Assertion {
  constraints: Constraint[];

  public [EQUALS_TO_METHOD](another: this): boolean {
    let result = true;
    result = result && equals(this.constraints, another.constraints);
    return result;
  }

  public abstract tryParse(target: Target, options: Readonly<ParsingOptions>): any;
  public abstract trySerialize(target: Target, options: Readonly<SerializationOptions>): any;
}
