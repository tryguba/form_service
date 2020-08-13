import { ValidationError } from '../errors/validation.error';
import { Target } from '../target';
import { AAssertion } from './assertion.abstract';


export class BooleanAssertion extends AAssertion {
  public tryParse(target: Target): any {
    return typeof target.value === 'boolean' ? target.value : undefined;
  }

  public trySerialize(target: Target): any {
    return typeof target.value === 'boolean' ? target.value : undefined;
  }

  public tryValidate(target: Target): ValidationError | null | undefined {
    if (typeof target.value === 'boolean') {
      return null; /// @todo apply constraints
    } else {
      return undefined;
    }
  }

  public tryCopy(value: any): any {
    return typeof value === 'boolean' ? value : undefined;
  }

}
