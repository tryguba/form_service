import { AbstractConstructor, Constructor } from '../../reactive/constructor';
import { ClassDefinition } from '../definition/class.definition';
import { ISignature } from './signature.interface';

export interface IType<InstanceType extends object = object> {
  readonly signature: ISignature;
  readonly definition: ClassDefinition;

  cls?: AbstractConstructor<InstanceType>;
}
