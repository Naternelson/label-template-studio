/**
 * This file provides the GamepadProvider component and custom hooks for managing gamepad input in a React application.
 * It includes functionality for handling gamepad connections, disconnections, and real-time input events.
 * The GamepadProvider component supplies context to manage button and axis event listeners for gamepads.
 * The custom hooks handle the addition and removal of listeners, as well as the polling of gamepad states.
 */

import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import {
	AddAxisListenerType,
	AddButtonListenerType,
	AxisCallback,
	AxisChangeEvent,
	ButtonCallback,
	ButtonChangeEvent,
	ButtonMap,
	DefaultButtonMap,
	GamepadContextType,
	getButtonKeys,
	RemoveAxisListenerType,
	RemoveButtonListenerType,
} from './util';
import { GamepadContext } from './GamepadContext';

/**
 * GamepadProvider component provides context for managing gamepad input.
 * It initializes and provides the necessary methods for handling gamepad events.
 */
export const GamepadProvider = (
	props: PropsWithChildren<{
		disabled: boolean;
		buttonMap?: ButtonMap;
		onConnect?: (event: GamepadEvent) => void;
		onDisconnect?: (event: GamepadEvent) => void;
	}>,
) => {
	const { disabled, buttonMap = DefaultButtonMap, onConnect, onDisconnect, children } = props;

	// Use custom hooks to manage button and axis listeners
	const { buttonListeners, addButtonListener, removeButtonListener } = useButtonListeners();
	const { axisListeners, addAxisListener, removeAxisListener } = useAxisListeners();

	// Initialize gamepad listening functionality
	useListening({ disabled, buttonListeners, axisListeners, onConnect, onDisconnect, buttonMap });

	// Context value to be provided to consumers
	const value: GamepadContextType = {
		addButtonListener,
		addAxisListener,
		removeButtonListener,
		removeAxisListener,
		buttonMap,
		buttonKeys: getButtonKeys(buttonMap),
		disabled,
	};

	return <GamepadContext.Provider value={value}>{children}</GamepadContext.Provider>;
};

/**
 * Rounds the axis value to three decimal places.
 * @param value - The axis value to be sanitized.
 */
const sanitizeAxisValue = (value: number) => {
	return Math.round(value * 1000) / 1000;
};

/**
 * Custom hook to handle gamepad connections, disconnections, and polling for input events.
 * It manages the addition and removal of gamepad event listeners and polls the gamepad state.
 */
const useListening = (params: {
	disabled: boolean;
	buttonMap: ButtonMap;
	buttonListeners: Record<string, ButtonCallback[]>;
	axisListeners: Record<string, AxisCallback[]>;
	onConnect?: (event: GamepadEvent) => void;
	onDisconnect?: (event: GamepadEvent) => void;
}) => {
	const { disabled, buttonListeners, buttonMap, axisListeners, onConnect, onDisconnect } = params;
	const previousButtonValues = useRef<boolean[]>([]);
	const previousAxisValues = useRef<number[]>([]);
	const animationFrame = useRef<number | null>(null);
	const [connected, setConnected] = useState(false);

	// Pauses the animation frame for polling
	const pause = useCallback(() => {
		if (animationFrame.current) {
			cancelAnimationFrame(animationFrame.current);
			animationFrame.current = null;
		}
	}, []);

	// Returns the button name for the given index from the button map
	const getButtonName = useCallback(
		(index: number) => {
			for (const [name, value] of Object.entries(buttonMap.button)) {
				if (value === index) return name;
			}
			return index.toString();
		},
		[buttonMap.button],
	);

	// Returns the axis name for the given index from the axis map
	const getAxisName = useCallback(
		(index: number) => {
			for (const [name, value] of Object.entries(buttonMap.axis)) {
				if (value === index) return name;
			}
			return index.toString();
		},
		[buttonMap.axis],
	);

	// Captures the previous value of the button or axis for change detection
	const capturePreviousValue = useCallback((gamepad: Gamepad, type: 'button' | 'axis', index: number) => {
		if (type === 'button') {
			previousButtonValues.current[index] = gamepad.buttons[index].pressed;
		} else if (type === 'axis') {
			previousAxisValues.current[index] = sanitizeAxisValue(gamepad.axes[index]);
		}
	}, []);

	// Handles gamepad events (button and axis changes) and calls registered listeners
	const handleGameEvent = useCallback(
		(event: ButtonChangeEvent | AxisChangeEvent) => {
			try {
				if (event.type === 'button') {
					const listeners = buttonListeners[event.name];
					if (listeners) {
						let stop = false;
						const stopPropagation = () => {
							stop = true;
						};
						for (const listener of listeners) {
							listener({ ...event, stopPropagation });
							if (stop) break;
						}
					}
				} else if (event.type === 'axis') {
					const listeners = axisListeners[event.name];
					if (listeners) {
						let stop = false;
						const stopPropagation = () => {
							stop = true;
						};
						for (const listener of listeners) {
							listener({ ...event, stopPropagation });
							if (stop) break;
						}
					}
				}
			} catch (error) {
				console.error('Error handling game event:', error);
			}
		},
		[axisListeners, buttonListeners],
	);

	// Polls the gamepad state and generates events for button and axis changes
	const handlePolling = useCallback(() => {
		try {
			const gamepads = navigator.getGamepads();
			for (const gamepad of gamepads) {
				if (gamepad) {
					gamepad.buttons.forEach((button, index) => {
						const event: ButtonChangeEvent = {
							type: 'button',
							name: getButtonName(index),
							index,
							value: button.pressed,
							previousValue: previousButtonValues.current[index],
							gamepad,
							stopPropagation: () => {},
						};
						handleGameEvent(event);
						capturePreviousValue(gamepad, 'button', index);
					});
					gamepad.axes.forEach((value, index) => {
						const event: AxisChangeEvent = {
							type: 'axis',
							name: getAxisName(index),
							index,
							value,
							previousValue: previousAxisValues.current[index],
							gamepad,
							stopPropagation: () => {},
						};
						handleGameEvent(event);
						capturePreviousValue(gamepad, 'axis', index);
					});
				}
			}
			animationFrame.current = requestAnimationFrame(handlePolling);
		} catch (error) {
			console.error('Error during polling:', error);
			pause();
		}
	}, [capturePreviousValue, getAxisName, getButtonName, handleGameEvent, pause]);

	// Handles gamepad connection events
	const handleConnect = useCallback(
		(event: GamepadEvent) => {
			try {
				onConnect?.(event);
				setConnected(true);
				animationFrame.current = requestAnimationFrame(handlePolling);
			} catch (error) {
				console.error('Error handling gamepad connect:', error);
			}
		},
		[handlePolling, onConnect],
	);

	// Handles gamepad disconnection events
	const handleDisconnect = useCallback(
		(event: GamepadEvent) => {
			try {
				onDisconnect?.(event);
				setConnected(false);
				pause();
			} catch (error) {
				console.error('Error handling gamepad disconnect:', error);
			}
		},
		[onDisconnect, pause],
	);

	// Sets up event listeners for gamepad connections and disconnections
	useEffect(() => {
		try {
			window.addEventListener('gamepadconnected', handleConnect);
			window.addEventListener('gamepaddisconnected', handleDisconnect);
		} catch (error) {
			console.error('Error adding event listeners:', error);
		}

		return () => {
			try {
				window.removeEventListener('gamepadconnected', handleConnect);
				window.removeEventListener('gamepaddisconnected', handleDisconnect);
			} catch (error) {
				console.error('Error removing event listeners:', error);
			}
		};
	}, [handleConnect, handleDisconnect]);

	// Starts polling if gamepad input is enabled and a gamepad is connected
	useEffect(() => {
		if (disabled || !connected) return pause();

		animationFrame.current = requestAnimationFrame(handlePolling);
		return () => pause();
	}, [pause, connected, disabled, handlePolling]);
};

/**
 * Custom hook to manage button listeners.
 * Provides methods to add and remove button listeners.
 */
const useButtonListeners = () => {
	const [buttonListeners, setButtonListeners] = useState<Record<string, ButtonCallback[]>>({});

	const removeButtonListener: RemoveButtonListenerType = (buttonName: string, callback: ButtonCallback) => {
		setButtonListeners((prev) => {
			const newListeners = { ...prev };
			if (newListeners[buttonName]) {
				newListeners[buttonName] = newListeners[buttonName].filter((listener) => listener !== callback);
				if (newListeners[buttonName].length === 0) {
					delete newListeners[buttonName];
				}
			}
			return newListeners;
		});
	};

	const addButtonListener: AddButtonListenerType = (buttonName: string, callback: ButtonCallback) => {
		setButtonListeners((prev) => {
			const newListeners = { ...prev };
			if (!newListeners[buttonName]) {
				newListeners[buttonName] = [];
			}
			newListeners[buttonName].push(callback);
			return newListeners;
		});
		return () => removeButtonListener(buttonName, callback);
	};

	return {
		buttonListeners,
		addButtonListener,
		removeButtonListener,
	};
};

/**
 * Custom hook to manage axis listeners.
 * Provides methods to add and remove axis listeners.
 */
const useAxisListeners = () => {
	const [axisListeners, setAxisListeners] = useState<Record<string, AxisCallback[]>>({});

	const removeAxisListener: RemoveAxisListenerType = (axisName: string, callback: AxisCallback) => {
		setAxisListeners((prev) => {
			const newListeners = { ...prev };
			if (newListeners[axisName]) {
				newListeners[axisName] = newListeners[axisName].filter((listener) => listener !== callback);
				if (newListeners[axisName].length === 0) {
					delete newListeners[axisName];
				}
			}
			return newListeners;
		});
	};

	const addAxisListener: AddAxisListenerType = (axisName: string, callback: AxisCallback) => {
		setAxisListeners((prev) => {
			const newListeners = { ...prev };
			if (!newListeners[axisName]) {
				newListeners[axisName] = [];
			}
			newListeners[axisName].push(callback);
			return newListeners;
		});
		return () => removeAxisListener(axisName, callback);
	};

	return {
		axisListeners,
		addAxisListener,
		removeAxisListener,
	};
};
