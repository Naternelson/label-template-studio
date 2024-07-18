export type ButtonMap = {
	button: Record<string, number>;
	axis: Record<string, number>;
};

export const DefaultButtonMap: ButtonMap = {
	button: {
		A: 0,
		B: 1,
		X: 2,
		Y: 3,
		L: 4,
		R: 5,
		ZL: 6,
		ZR: 7,
		PLUS: 8,
		MINUS: 9,
		LCLICK: 10,
		RCLICK: 11,
		HOME: 12,
		CAPTURE: 13,
	},
	axis: {
		LEFT: 0,
		RIGHT: 1,
	},
};

export type GamepadChangeEvent = {
	type: 'button' | 'axis';
	name: string;
	index: number;
	value: number | boolean;
	previousValue?: number | boolean;
	gamepad: Gamepad;
	stopPropagation: () => void;
};

export interface ButtonChangeEvent extends GamepadChangeEvent {
	type: 'button';
	value: boolean;
	previousValue?: boolean;
}

export interface AxisChangeEvent extends GamepadChangeEvent {
	type: 'axis';
	value: number;
	previousValue?: number;
}

export type ButtonCallback = (event: ButtonChangeEvent) => void;
export type AxisCallback = (event: AxisChangeEvent) => void;

export type AddButtonListenerType = (buttonName: string, callback: ButtonCallback) => () => void;
export type AddAxisListenerType = (axisIndex: string, callback: AxisCallback) => () => void;
export type RemoveButtonListenerType = (buttonName: string, callback: ButtonCallback) => void;
export type RemoveAxisListenerType = (axisName: string, callback: AxisCallback) => void;

export type GamepadContextType = {
	addButtonListener: AddButtonListenerType;
	addAxisListener: AddAxisListenerType;
	removeButtonListener: RemoveButtonListenerType;
	removeAxisListener: RemoveAxisListenerType;
	buttonMap: ButtonMap;
	buttonKeys: {
		button: Record<string, string>;
		axis: Record<string, string>;
	};
	disabled?: boolean;
};

export const getButtonKeys = (buttonMap: ButtonMap): GamepadContextType['buttonKeys'] => {
	const buttonKeys: Record<string, string> = {};
	const axisKeys: Record<string, string> = {};
	for (const [key, value] of Object.entries(buttonMap.button)) {
		buttonKeys[value] = key;
	}
	for (const [key, value] of Object.entries(buttonMap.axis)) {
		axisKeys[value] = key;
	}

	return {
		button: buttonKeys,
		axis: axisKeys,
	};
};
