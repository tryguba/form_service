import { AbstractConstructor } from '../../reactive/constructor';
import { Signature } from './signature';
import { IType } from './type.interface';

export class Type<InstanceType extends object = object> implements IType<InstanceType> {
  readonly signature: Signature;
  readonly definition: any;
  cls?: AbstractConstructor<InstanceType>;
}
