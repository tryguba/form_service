import { ISignature } from './signature.interface';

export class Signature implements ISignature {
  readonly name: string;
  readonly version: number;
}
