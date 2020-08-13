import { ObjectAssertion } from '../assertion/object.assertion';
import { ISignature } from '../registry/signature.interface';
import { TypeRegistry } from '../registry/type.registry';
import { ValueDefinition } from './value.definition';


export class ClassDefinition extends ObjectAssertion {
  title?: string;
  description?: string;
  base?: ISignature;
  abstract: boolean;

  public collectDefinedProperties(registry: TypeRegistry, target: Set<string>): void {
    const base = this.base ? registry.bySignature(this.base) : undefined;
    if (base) {
      base.definition.collectDefinedProperties(registry, target);
    }
    for (const property of super.listDefinedProperties(registry)) {
      target.add(property);
    }
  }

  public listDefinedProperties(registry: TypeRegistry): Iterable<string> {
    const target: Set<string> = new Set();
    this.collectDefinedProperties(registry, target);
    return target;
  }

  public getPropertyDefinition(name: string, registry: TypeRegistry): ValueDefinition | null | undefined {
    let definition = super.getPropertyDefinition(name, registry);
    if (!definition) {
      const base = this.base ? registry.bySignature(this.base) : undefined;
      if (base) {
        definition = base.definition.getPropertyDefinition(name, registry);
      }
    }
    return definition;
  }
}
