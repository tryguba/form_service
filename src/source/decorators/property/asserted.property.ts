import { Constructor } from '../../reactive/constructor';
import { definePropertyAssertion } from '../../helpers/define.property.assertion';
import { ObjectBuilder } from '../../helpers/object.builder';
import { ConstraintHelpers } from '../../helpers/reflect';
import { Assertion } from '../../metadata/assertion';
import { PropertyOptions } from './property.options';

export function AssertedProperty(AssertionClass: Constructor<Assertion, []>, constraintsMetadataKey?: string | symbol, options?: Readonly<PropertyOptions>): PropertyDecorator {
  return function (target, propertyKey) {
    if (!(typeof propertyKey === 'string')) {
      throw new Error('Illegal usage!'); /// @todo throw IllegalUsageError
    }
    // @ts-ignore
    const assertion = (new ObjectBuilder(AssertionClass))
      .set('constraints', ConstraintHelpers.persist(target, propertyKey, constraintsMetadataKey))
      .build();
    ConstraintHelpers.clear(target, propertyKey, constraintsMetadataKey);
    definePropertyAssertion(target, propertyKey, assertion);
  };
}
