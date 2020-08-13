import { Target } from '../target';
import { AAssertion } from './assertion.abstract';
import { ValidationError } from '../errors/validation.error';


export class StringAssertion extends AAssertion {
  public tryParse(target: Target): string | undefined {
    return typeof target.value === 'string' ? target.value : undefined;
  }

  public tryValidate(target: Target): ValidationError | null | undefined {
    if (typeof target.value === 'string') {
      return null; /// @todo apply constraints
    } else {
      return undefined;
    }
  }

  public tryCopy(target: Target): string | undefined {
    return typeof target.value === 'string' ? target.value : undefined;
  }

  public trySerialize(target: Target): string | undefined {
    return typeof target.value === 'string' ? target.value : undefined;
  }
}
