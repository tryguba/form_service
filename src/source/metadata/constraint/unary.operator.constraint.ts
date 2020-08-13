import { EQUALS_TO_METHOD } from '../../helpers/interfaces/comparable';
import { ValidationError } from '../errors/validation.error';
import { Target } from '../target';
import { Constraint } from './constraint.interface';


export abstract class UnaryOperatorConstraint<ValueType> implements Constraint {
  public check<T extends Target<ValueType>>(target: T): ValidationError<T> | null {
    return this._operator(target.value) ? null : this._error(target);
  }

  public abstract [EQUALS_TO_METHOD](another: this): boolean;
  public abstract clone(): this;

  protected abstract _operator(value: ValueType): boolean;
  protected abstract _error<T extends Target<ValueType>>(target: T): ValidationError<T>;
}
