import { Constructor } from '../../reactive/constructor';
import { equals } from '../../helpers/equal';
import { ISignature } from './signature.interface';
import { IType } from './type.interface';


const registries: any = {};
const META_SCHEME = Symbol('type-registry:meta');
const DEFAULT_SCOPE = Symbol('type-registry:default');

export class TypeRegistry {
  public static scope(scope?: string | symbol): TypeRegistry {
    const _scope = scope === undefined ? DEFAULT_SCOPE : scope;
    let registry: TypeRegistry | undefined = registries[_scope];
    if (!(registry instanceof TypeRegistry)) {
      registries[_scope] = registry = new TypeRegistry(scope)
    }
    return registry;
  }

  public readonly scope?: string | symbol;
  public readonly types: ReadonlyArray<IType>;

  public constructor(scope?: string | symbol) {
    this.scope = scope;
    this.types = [];
  }

  public register(type: IType) {
    (this.types as Array<IType>).push(type);
  }

  public bySignature(signature: ISignature): IType | undefined {
    return this.types.find((type) => equals(type.signature, signature));
  }

  public byConstructor<InstanceType extends object>(cls: Constructor<InstanceType>): IType<InstanceType>[] {
    // @todo use definitions
    return this.types.filter((type) => type.cls ? type.cls.prototype instanceof cls : false) as IType<InstanceType>[];
  }
}
