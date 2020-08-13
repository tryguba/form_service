import {
  BooleanAssertion,
  NullAssertion,
  NumberAssertion,
  StringAssertion,
} from '../../metadata/assertion';
import { SignedInstanceAssertion } from '../../metadata/assertion/signed.instance.assertion';
import { AssertedProperty } from './asserted.property';
import { PropertyOptions } from './property.options';

export function BooleanProperty(options?: Readonly<PropertyOptions>): PropertyDecorator {
  return AssertedProperty(BooleanAssertion, undefined, options);
}

export function NumberProperty(options?: Readonly<PropertyOptions>): PropertyDecorator {
  return AssertedProperty(NumberAssertion, undefined, options);
}

export function StringProperty(options?: Readonly<PropertyOptions>): PropertyDecorator {
  return AssertedProperty(StringAssertion, undefined, options);
}

export function NullProperty(options?: Readonly<PropertyOptions>): PropertyDecorator {
  return AssertedProperty(NullAssertion, undefined, options);
}

export function SignedInstanceProperty(options?: Readonly<PropertyOptions>): PropertyDecorator {
  return AssertedProperty(SignedInstanceAssertion, undefined, options);
}

// export function ObjectProperty<InstanceType extends Object>(InstanceClass: Constructor<InstanceType, []>, options?: Readonly<PropertyOptions>): PropertyDecorator {
//   return AssertedProperty(ObjectAssertion, undefined, options);
// }
//
// export function InstanceProperty<InstanceType extends Object>(InstanceClass: Constructor<InstanceType, []>, options?: Readonly<PropertyOptions>): PropertyDecorator {
//   return AssertedProperty(InstanceAssertion, undefined, options);
// }
