import { DeepPartial, StateWithHistory, StateWithoutHistory } from "./types";

/**
 * Toggles the locked property for a given attribute path in the state.
 * @param {T} state - The state object.
 * @param {string} attributePath - The path to the attribute to toggle the locked property (e.g., "position.x").
 */
export const toggleLockedProperty = <T extends Record<string, any>>(state: T, attributePath: string) => {
	const pathSegments = attributePath.split('.');
	let target = state;

	for (let i = 0; i < pathSegments.length - 1; i++) {
		target = target[pathSegments[i]];
		if (!target) {
			return;
		}
	}

	const finalSegment = pathSegments[pathSegments.length - 1];
	if (target[finalSegment] && typeof target[finalSegment] === 'object' && 'locked' in target[finalSegment]) {
		target[finalSegment].locked = !target[finalSegment].locked;
	}
};

export const setLockedProperty = <T extends Record<string, any>>(state: T, attributePath: string, value: boolean) => {
	const pathSegments = attributePath.split('.');
	let target = state;

	for (let i = 0; i < pathSegments.length - 1; i++) {
		target = target[pathSegments[i]];
		if (!target) {
			return;
		}
	}

	const finalSegment = pathSegments[pathSegments.length - 1];
	if (target[finalSegment] && typeof target[finalSegment] === 'object' && 'locked' in target[finalSegment]) {
		target[finalSegment].locked = value;
	}
}



export const addSnapshot = <
	T extends { past: StateWithoutHistory<T>[]; future: StateWithoutHistory<T>[]; groupId?: string },
>(
	state: T,
	groupId?: string,
	maxHistory: number = 50,
) => {
	const snap: StateWithoutHistory<T> = {
		...state,
		past: undefined,
		future: undefined,
	} as StateWithoutHistory<T>;

	if (groupId === undefined || groupId !== state.groupId) {
		if (state.past.length >= maxHistory) {
			state.past.shift(); // Remove the oldest state to maintain the max history limit
		}
		state.past.push(snap);
		state.future = [];
	}
	state.groupId = groupId;
};



export const undo = <T extends StateWithHistory<T>>(state: T): T => {
	if (state.past.length === 0) {
		return state; // No past states to undo
	}

	const newFuture = [state as StateWithoutHistory<T>, ...state.future];
	const previousState = state.past[state.past.length - 1];

	return {
		...previousState,
		past: state.past.slice(0, -1),
		future: newFuture,
	} as T;
};

export const redo = <T extends StateWithHistory<T>>(state: T): T => {
	if (state.future.length === 0) {
		return state; // No future states to redo
	}

	const newPast = [...state.past, state as StateWithoutHistory<T>];
	const nextState = state.future[0];

	return {
		...nextState,
		past: newPast,
		future: state.future.slice(1),
	} as T;
};


export const updateProperties = <T extends Record<string, any>>(target: T, source: DeepPartial<T>): T => {
	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			const targetValue = target[key];
			const sourceValue = source[key];

			if (
				targetValue &&
				typeof targetValue === 'object' &&
				!Array.isArray(targetValue) &&
				'locked' in targetValue
			) {
				if (
					!targetValue.locked &&
					typeof sourceValue === 'object' &&
					!Array.isArray(sourceValue) &&
					sourceValue !== null
				) {
					updateProperties(targetValue, sourceValue as DeepPartial<typeof targetValue>);
				}
			} else if (typeof sourceValue === 'object' && !Array.isArray(sourceValue) && sourceValue !== null) {
				if (!targetValue || typeof targetValue !== 'object') {
					(target as any)[key] = {};
				}
				updateProperties(target[key] as Record<string, any>, sourceValue);
			} else {
				(target as any)[key] = sourceValue;
			}
		}
	}
	return target;
};