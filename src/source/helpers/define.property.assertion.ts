import { Assertion } from '../metadata/assertion';
import { ValueDefinition } from '../metadata/definition/value.definition';
import { ObjectBuilder } from './object.builder';
import { DefinitionHelpers } from './reflect';

export function definePropertyAssertion(target: Object, propertyKey: string, assertion: Assertion) {
  const targetDefinition = DefinitionHelpers.persist(target);
  let valueDefinition: ValueDefinition | null = null;
  if (targetDefinition.properties.hasOwnProperty(propertyKey)) {
    valueDefinition = targetDefinition.properties[propertyKey];
  }
  if (!valueDefinition) {
    valueDefinition = (new ObjectBuilder(ValueDefinition))
      .set('assert', [])
      .set('title', propertyKey)
      .set('required', true)
      .build();
  }

  valueDefinition.assert.push(assertion);
  targetDefinition.properties[propertyKey] = valueDefinition;
}
