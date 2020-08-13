import { Target } from '../target';
import { AAssertion } from './assertion.abstract';
import { ValidationError } from '../errors/validation.error';


export class NullAssertion extends AAssertion {
  public tryParse(target: Target): null | undefined {
    return target.value === null ? null : undefined;
  }

  public trySerialize(target: Target): null | undefined {
    return target.value === null ? null : undefined;
  }

  public tryValidate(target: Target): ValidationError | null | undefined {
    return target.value === null ? null : undefined;
  }

  public tryCopy(value: any): any {
    return value === null ? null : undefined;
  }
}
