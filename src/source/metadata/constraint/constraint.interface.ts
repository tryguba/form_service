import { Cloneable } from '../../helpers/interfaces/cloneable';
import { Comparable } from '../../helpers/interfaces/comparable';
import { ValidationError } from '../errors/validation.error';
import { Target } from '../target';


export interface Constraint extends Comparable, Cloneable {
  check(target: Target): ValidationError | null;
}



// В критичній ситуації, коли вночі подзвонить начальник ОТП, він теж скаже, що втомлений?
