
interface Constraint<T = any> {
  property(value: T, key: string, target: object): void;
  item(value: T, key: number, target: any[]): void;
}

interface StringConstraint extends Constraint<string> {

}

interface NumberConstraint extends Constraint<number> {

}

interface BooleanConstraint extends Constraint<boolean> {

}

interface ArrayConstraint extends Constraint<any[]> {

}

interface Resolution {
}

interface Assertion {

}

interface StringAssertion extends Assertion {
  constraints: StringConstraint[];
}

interface NumberAssertion extends Assertion {
  constraints: NumberConstraint[];
}

interface BooleanAssertion extends Assertion {
  constraints: BooleanConstraint[];
}

interface ArrayAssertion extends Assertion {
  items: Array<ValueDefinition | null>;
  unexpected?: ValueDefinition;
  constraints: ArrayConstraint[];
}

interface InstanceOfAssertion extends Assertion {
  type: string;
}

interface ObjectAssertion extends Assertion {
  properties: {
    [key: string]: ValueDefinition;
  };
  unexpected?: ValueDefinition;
}

interface NullAssertion extends Assertion {

}

interface ValueDefinition {
  title?: string;
  description?: string;
  required: boolean;
  assert: Assertion[];
}


export interface ObjectDefinition extends ObjectAssertion {
  title?: string;
  description?: string;
  base?: string;
  abstract: boolean;
}



type Registry = Array<{
  type: string;
  version: number;
  definition: ObjectDefinition;
}>;

const X = {
  __meta: {
    type: 'com.temabit.pizza.SuperForm',
    version: 1,
  },
  items: [
    {

    }
  ],

};

const Y = {
  __meta: {
    type: 'com.temabit.pizza.AnotherForm',
    version: 1,
  },
  items: [
    {

    }
  ],
  anotherField: 10,
};



