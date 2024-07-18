import { useEffect, useLayoutEffect } from 'react';
import { reposition, repositionInitialPosition, sanitizeParams, UseDraggableParams } from '../util';
import { useGamepadListeners, useKeyListeners, useMouseListeners, useTouchHandlers } from '../handlers';

export const useDraggable = (params: UseDraggableParams) => {
	const { containerId, contentId, disabled, boundary, center } = sanitizeParams(params);
	const { attachListeners: keyListeners, panning: kPanning } = useKeyListeners({
		disabled: !!disabled,
	});
	const { attachListeners: mouseListeners, panning: mPanning } = useMouseListeners({
		spaceDown: kPanning,
		contentId,
		containerId,
		boundaries: boundary,
		center,
		disabled,
	});

	const { attachListeners: touchListeners, panning: tPanning } = useTouchHandlers({
		contentId,
		containerId,
		center,
		boundary,
		disabled,
	});

	const { attachListeners: gamepadListeners } = useGamepadListeners({
		contentId,
		containerId,
		center,
		boundary,
		disabled,
	});

	useEffect(() => {
		const unsubMListeners = mouseListeners();
		const unsubTListeners = touchListeners();
		const unsubKListeners = keyListeners();
		const unsubGListeners = gamepadListeners();

		return () => {
			unsubMListeners();
			unsubTListeners();
			unsubKListeners();
			unsubGListeners();
		};
	}, [
		containerId,
		contentId,
		disabled,
		boundary,
		center,
		mouseListeners,
		touchListeners,
		keyListeners,
		gamepadListeners,
	]);

	useLayoutEffect(() => {
		repositionInitialPosition({ containerId, contentId, boundary, center });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const container = document.getElementById(containerId);
		const content = document.getElementById(contentId);
		if (!container || !content) {
			console.warn('Parent or content element not found');
			return;
		}
		const observer = new ResizeObserver(() => reposition({ containerId, contentId, center, boundary }));
		const contentObserver = new ResizeObserver(() => reposition({ containerId, contentId, center, boundary }));

		observer.observe(container);
		contentObserver.observe(content);
		return () => {
			observer.disconnect();
			contentObserver.disconnect();
		};
	}, [containerId, contentId, boundary, center]);

	return {
		isPanning: [mPanning, tPanning, kPanning].some((p) => p),
		panning: {
			mouse: mPanning,
			touch: tPanning,
			keyboard: kPanning,
		},
		cursor: mPanning ? 'grabbing' : kPanning ? 'grab' : undefined,
	};
};
