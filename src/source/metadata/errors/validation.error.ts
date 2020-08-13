import { Target } from '../target';


export class ValidationError<ValueType = any> extends Error {
  public readonly target: Target<ValueType>;

  public constructor(target: Target<ValueType>, reason: string) {
    super(reason);
    this.target = target;
  }
}
