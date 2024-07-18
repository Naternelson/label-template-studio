import { useCallback } from 'react';
import { Boundary, Center, reposition, setElementPosition, centerElement } from '../util';
import { AxisCallback, ButtonCallback, buttonMapping, useGamepad } from '../../GamepadProvider';

export type useGamepadListenersParams = {
	contentId: string;
	containerId: string;
	center: Center | undefined;
	boundary: Boundary | undefined;
	disabled: boolean | undefined;
};
export const useGamepadListeners = (params: useGamepadListenersParams) => {
	const { contentId, containerId, center, boundary, disabled } = params;

	const getElements = useCallback(() => {
		const container = document.getElementById(containerId);
		const content = document.getElementById(contentId);
		if (!container || !content) {
			console.warn('Parent or content element not found');
			return null;
		}
		return { container, content };
	}, [containerId, contentId]);

	const handleAxisChange = useCallback<AxisCallback>(
		(value) => {
			if (disabled) return;
			const dx = Math.round(value * 15); // adjust speed as needed
			const dy = Math.round(value * 15); // adjust speed as needed
			const elements = getElements();
			if (!elements) return;
			const { content } = elements;
			setElementPosition(content, (prev) => ({
				...prev,
				left: prev.left + dx,
				top: prev.top + dy,
			}));
			if ([dx, dy].every((v) => v === 0)) {
				reposition({ containerId, contentId, center, boundary });
			}
		},
		[boundary, center, containerId, contentId, disabled, getElements],
	);

	const handleZLPress = useCallback<ButtonCallback>(
		(pressed) => {
			if (disabled) return;
			if (pressed) {
				const elements = getElements();
				if (elements) {
					centerElement(elements);
				}
			}
		},
		[disabled, getElements],
	);

	const { addButtonListener, addAxisListener } = useGamepad();

	const attachListeners = useCallback(() => {
		const listeners = [addButtonListener('LeftBumper', handleZLPress), addAxisListener(0, handleAxisChange)];
		return () => {
			listeners.forEach((unsub) => unsub());
		}
	}, [addAxisListener, addButtonListener, handleAxisChange, handleZLPress]);

	return { attachListeners };
};
