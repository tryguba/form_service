import { Target } from '../target';
import { AAssertion } from './assertion.abstract';
import { ValidationError } from '../errors/validation.error';


export class NumberAssertion extends AAssertion {
  public tryParse(target: Target): number | undefined {
    return typeof target.value === 'number' ? target.value : undefined;
  }

  public trySerialize(target: Target): number | undefined {
    return typeof target.value === 'number' ? target.value : undefined;
  }

  public tryValidate(value: any): ValidationError | null | undefined {
    if (typeof value === 'number') {
      return null; /// @todo apply constraints
    } else {
      return undefined;
    }
  }

  public tryCopy(value: any): any {
    return typeof value === 'number' ? value : undefined;
  }

}
