import 'reflect-metadata';
import { ClassDefinition } from '../metadata/definition/class.definition';
import { ObjectDefinitionSymbol } from '../symbols/metadata/object.definition.symbol';
import { PropertyConstraintSymbol } from '../symbols/metadata/property.constraint.symbol';
import { Constructor } from '../reactive/constructor';

export function MethodParameter(index: number, decorator: ParameterDecorator): MethodDecorator {
  return (target, propertyKey) => {
    decorator(target, propertyKey, index);
  }
}

export function ConstructorParameter(index: number, decorator: ParameterDecorator): ClassDecorator {
  return (target) => {
    decorator(target, undefined as any, index);
  }
}

function _decorate(decorators: ClassDecorator[], target: Function): Function;
function _decorate(decorators: (PropertyDecorator | MethodDecorator)[], target: Object, propertyKey: string | symbol, attributes?: PropertyDescriptor): PropertyDescriptor;
function _decorate(decorators: (ClassDecorator | PropertyDecorator | MethodDecorator)[], target: Object, propertyKey?: string | symbol, attributes?: PropertyDescriptor): any {
  if (typeof target === 'function' && propertyKey === undefined) { /// class decorator
    let r = target;
    for (let i = decorators.length; i !== 0; ) {
      r = (decorators[--i] as ClassDecorator)(target) || r;
    }
    return r;
  } else {
    let r = attributes;
    for (let i = decorators.length; i !== 0; ) {
      const d = decorators[--i];
      r = (d as MethodDecorator | PropertyDecorator)(target, propertyKey!, r!) || r;
    }
    return r;
  }
}

const _deco = typeof Reflect === 'object' && typeof Reflect.decorate === 'function' ? Reflect.decorate : _decorate;

export class ReflectHelpers {
  public static decorate<TFunction extends Function>(decorators: ClassDecorator[], target: TFunction): TFunction;
  public static decorate(decorators: (PropertyDecorator | MethodDecorator)[], target: Object, propertyKey: string | symbol, attributes?: PropertyDescriptor): PropertyDescriptor;
  public static decorate(decorators: (ClassDecorator | PropertyDecorator | MethodDecorator)[], target: Object, propertyKey?: string | symbol, attributes?: PropertyDescriptor): any {
    if (typeof target === 'function' && propertyKey === undefined) {
      return _deco(decorators as ClassDecorator[], target);
    } else {
      return _deco(decorators as (MethodDecorator | PropertyDecorator)[], target, propertyKey!, attributes);
    }
  }
}

export class ConstraintHelpers {
  public static persist(target: Object, propertyKey: string, metadataKey: string | symbol = PropertyConstraintSymbol): any[] {
    let constraints = Reflect.getMetadata(metadataKey, target, propertyKey);
    if (constraints === undefined) {
      Reflect.defineMetadata(metadataKey, constraints = [], target, propertyKey);
    }
    return constraints;
  }

  public static clear(target: Object, propertyKey: string, metadataKey: string | symbol = PropertyConstraintSymbol) {
    Reflect.deleteMetadata(metadataKey, target, propertyKey);
  }
}

export class DefinitionHelpers {
  public static persist(target: Object): ClassDefinition {
    let definition: ClassDefinition | undefined = Reflect.getOwnMetadata(ObjectDefinitionSymbol, target);
    if (!definition) {
      const parent = Object.getPrototypeOf(target);
      if (parent === null) {
        definition = new ClassDefinition();
        definition.properties = {};
      } else {
        const parentDefinition = DefinitionHelpers.persist(parent);
        definition = Object.create(parentDefinition) as ClassDefinition;
        definition.properties = Object.create(parentDefinition.properties);
      }
      definition.target = target.constructor as Constructor;
      definition.abstract = false;
      definition.title = target.constructor.name;
      Reflect.defineMetadata(ObjectDefinitionSymbol, definition, target);
    }
    return definition;
  }

  public static clear(target: Object) {
    let definition: ClassDefinition | undefined = Reflect.getOwnMetadata(ObjectDefinitionSymbol, target);
    if (definition) {
      Reflect.deleteMetadata(ObjectDefinitionSymbol, target);
    }
  }
}
