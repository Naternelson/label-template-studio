import React, {useCallback } from 'react';
import { Boundary, Center, reposition, setElementPosition } from '../util';

type useMouseListenersParams = {
	spaceDown: boolean;
	contentId: string;
	containerId: string;
	boundaries: Boundary | undefined;
	center: Center | undefined;
	disabled: boolean | undefined;
};

export const useMouseListeners = (params: useMouseListenersParams) => {
	const { spaceDown, contentId, containerId, boundaries, center, disabled } = params;
	const startX = React.useRef<number>(0);
	const startY = React.useRef<number>(0);
	const [panning, setPanning] = React.useState<boolean>(false);

	const getElements = useCallback(() => {
		const container = document.getElementById(containerId);
		const content = document.getElementById(contentId);
		if (!container || !content) {
			console.warn('Parent or content element not found');
			return null;
		}
		return { container, content };
	}, [containerId, contentId]);

	const handleMouseDown = useCallback(
		(e: MouseEvent) => {
			if (disabled) return;
			if ([1].includes(e.button) || spaceDown) {
				e.preventDefault();
				setPanning(true);
				startX.current = e.clientX;
				startY.current = e.clientY;
			}
		},
		[disabled, spaceDown],
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!panning) return;
			const elements = getElements();
			if (!elements) return;
			const dx = e.clientX - startX.current;
			const dy = e.clientY - startY.current;

			setElementPosition(elements.content, (prev) => ({
				...prev,
				left: prev.left + dx,
				top: prev.top + dy,
			}));

			startX.current = e.clientX;
			startY.current = e.clientY;
		},
		[getElements, panning],
	);

	const handleMouseUp = useCallback(() => {
		if (panning) {
			setTimeout(
				() =>
					reposition({
						containerId,
						contentId,
						center,
						boundary: boundaries,
					}),
				0,
			);
		}
		setPanning(false);
	}, [boundaries, center, containerId, contentId, panning]);

	const attachListeners = useCallback(() => {
		const elements = getElements();
		if (!elements) return () => {};
		const { container } = elements;

		container.addEventListener('mousedown', handleMouseDown);
		container.addEventListener('mousemove', handleMouseMove);
		container.addEventListener('mouseup', handleMouseUp);
		container.addEventListener('mouseleave', handleMouseUp);
		return () => {
			container.removeEventListener('mousedown', handleMouseDown);
			container.removeEventListener('mousemove', handleMouseMove);
			container.removeEventListener('mouseup', handleMouseUp);
			container.removeEventListener('mouseleave', handleMouseUp);
		}
	}, [getElements, handleMouseDown, handleMouseMove, handleMouseUp]);

	return {
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		attachListeners,
		panning, 
		setPanning
	};
};