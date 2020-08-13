import { ValidationError } from '../errors/validation.error';
import { ISignature } from '../registry/signature.interface';
import { IType } from '../registry/type.interface';
import { Target } from '../target';
import { AAssertion } from './assertion.abstract';
import { ParsingOptions, SerializationOptions } from './assertion.interface';

const SIGNATURE_PROPERTY = '__meta__';

export class SignedInstanceAssertion extends AAssertion {
  public tryParse(target: Target, options: Readonly<ParsingOptions>): any {
    const signature: ISignature | undefined = target.value[SIGNATURE_PROPERTY]; /// @todo parse and validate signature with meta registry
    const types: IType | undefined = signature ? options.registry.bySignature(signature) : undefined;
    // for (const type of types) {
    //   const result = type.definition.tryParse(target, options);
    //   if (result !== undefined) {
    //     return result;
    //   }
    // }
    return undefined;
  }

  public trySerialize(target: Target, options: Readonly<SerializationOptions>): any {
    return undefined; /// @todo implement method
  }

  public tryValidate(value: any): ValidationError | null | undefined {
    return undefined; /// @todo check instance, apply constraints
  }

  public tryCopy(value: any, context: Map<object, any>): any {
    return undefined; /// @todo implement method
  }
}
