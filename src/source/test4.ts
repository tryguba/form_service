import 'reflect-metadata';
import {ReactiveStorage} from './reactive/reactive.storage';
import {TrackedProperty} from './reactive/tracked.property';


type Writable<T> = {
	-readonly [key in keyof T]: T[key];
};

class FormService extends Object {

	@TrackedProperty({
		initial(): string {
			return 'Vasya';
		},
	})
	public name: string;

	@TrackedProperty({
		initial(): string {
			return 'Pupkin';
		},
	})
	public surname: string;

	@TrackedProperty({
		initial(): string {
			return 'pupkin@gmail.com';
		},
	})
	public email: string;

	@TrackedProperty({
		initial(): number {
			return 333255828;
		},
	})
	public phone: number;
}

export const instance = new FormService();

const storage = ReactiveStorage.persist(instance);
const emitter = storage.emitter;

let collectedChanges: Writable<FormService> = createChanges(null);

function createChanges(prev: Writable<FormService> | null): Writable<FormService> {
	if (prev) {
		const proto = Object.getPrototypeOf(prev);
		Object.assign(proto, prev);
		prev = Object.create(proto);
	} else {
		const proto = Object.create(null);
		for (const prop of storage.properties) {
			proto[prop] = storage.get(prop);
		}
		console.log('initials', proto);
		prev = Object.create(proto);
	}
	return prev!;
}

collectedChanges = createChanges(collectedChanges);

if (Object.keys(collectedChanges).length !== 0) {
	console.log(collectedChanges);
} else {
	console.log('No changes');
}
for (const prop of storage.properties) {
	emitter.on(prop, (value, prev) => {
		console.log('%s changed from %o to %o', prop, prev, value);
		Object.assign(collectedChanges, {
			[prop]: value
		});
		const proto = Object.getPrototypeOf(collectedChanges) as typeof collectedChanges;
		if (Object.is(proto[prop], value)) {
			delete collectedChanges[prop];
		}
	});
}