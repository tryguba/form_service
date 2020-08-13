import { PropertyOptions } from '../decorators/property/property.options';
import { TypeRegistry } from '../metadata/registry/type.registry';


export interface PropertyMetadata {
  registry: TypeRegistry;
}

export function resolvePropertyOptions(options: Readonly<PropertyOptions>): PropertyMetadata {
  return {
    registry: TypeRegistry.scope()
  }
}
