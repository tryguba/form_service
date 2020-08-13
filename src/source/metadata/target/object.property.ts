import { ATarget } from './target.abstract';

export class ObjectProperty<ObjectType extends object, PropertyType extends (keyof ObjectType & string) = (keyof ObjectType & string)> extends ATarget<ObjectType[PropertyType]> {
  public readonly relativePath: PropertyType;
  public constructor(object: ObjectType, property: PropertyType, parent?: ATarget) {
    super(object[property], property, parent);
  }

  public get property(): PropertyType {
    return this.relativePath;
  }
}
