import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { setElementPosition, getElementPosition, dBounds } from './util';

type Boundary = {
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
	x?: number;
	y?: number;
};

type Center = boolean | { x?: boolean; y?: boolean };

type UseDraggableParams = {
	/**
	 * The id of the container element
	 */
	containerId: string;
	/**
	 * The id of the content element, this will the element that will be adjusted its left and top properties
	 */
	contentId: string;
	/**
	 * If true, the draggable functionality will be disabled
	 */
	disabled?: boolean;
	/**
	 * The boundaries of the content element, the element will not be able to move outside these boundaries
	 * Provides a buffer of the specified number of pixels from the edge of the container
	 */
	boundary?: number | Boundary;
	/**
	 * Prioritize centering the element within the container, can be set to true to center both horizontally and vertically
	 */
	center?: Center;
};

export const useDraggable = (params: UseDraggableParams) => {
	const { containerId, contentId, disabled, boundary, center } = params;
	const startX = useRef(0);
	const startY = useRef(0);
	const [isPanning, setIsPanning] = useState(false);
	const [isSpaceDown, setIsSpaceDown] = useState(false);

	const getElements = useCallback(() => {
		const container = document.getElementById(containerId);
		const content = document.getElementById(contentId);
		if (!container || !content) {
			console.warn('Parent or content element not found');
			return null;
		}
		return { container, content };
	}, [containerId, contentId]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!disabled && e.key === ' ') {
				setIsSpaceDown(true);
			}
		},
		[disabled],
	);

	const handleKeyUp = useCallback((e: KeyboardEvent) => {
		if (e.key === ' ') {
			setIsSpaceDown(false);
		}
	}, []);

	const handleMouseDown = useCallback(
		(e: MouseEvent) => {
			if (disabled) return;
			if ([1].includes(e.button) || isSpaceDown) {
				e.preventDefault();
				setIsPanning(true);
				startX.current = e.clientX;
				startY.current = e.clientY;
			}
		},
		[isSpaceDown, disabled],
	);

	const handleMouseMove = useCallback(
		(content: HTMLElement) => (e: MouseEvent) => {
			if (disabled || !isPanning) return;
			const dx = e.clientX - startX.current;
			const dy = e.clientY - startY.current;

			setElementPosition(content, (prev) => ({
				...prev,
				left: prev.left + dx,
				top: prev.top + dy,
			}));

			startX.current = e.clientX;
			startY.current = e.clientY;
		},
		[isPanning, disabled],
	);

	const handleMouseUp = useCallback(() => {
		if (isPanning) {
			const elements = getElements();
			if (elements) {
				moveInBoundaries({ containerId, contentId, boundary });
			}
			setIsPanning(false);
		}
	}, [isPanning, getElements, boundary, containerId, contentId]);

	useEffect(() => {
		if (!isPanning) {
			reposition({ containerId, contentId, center, boundary });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPanning]);

	useEffect(() => {
		/**
		 * Attach event listeners
		 */
		const elements = getElements();
		if (!elements) return;
		const { container, content } = elements;

		const onMouseMove = handleMouseMove(content);
		container.addEventListener('mousedown', handleMouseDown);
		container.addEventListener('mousemove', onMouseMove);
		container.addEventListener('mouseup', handleMouseUp);
		container.addEventListener('mouseleave', handleMouseUp);
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		return () => {
			container.removeEventListener('mousedown', handleMouseDown);
			container.removeEventListener('mousemove', onMouseMove);
			container.removeEventListener('mouseup', handleMouseUp);
			container.removeEventListener('mouseleave', handleMouseUp);
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, [
		containerId,
		contentId,
		handleMouseUp,
		handleKeyDown,
		handleKeyUp,
		handleMouseDown,
		handleMouseMove,
		getElements,
	]);

	useLayoutEffect(() => {
		/** Disable transitiong, position the element appropriately, then reestablish transitioning */
		setIsPanning(true);
		repositionInitialPosition(params).then(() => {
			setIsPanning(false);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		isPanning,
		isSpaceDown,
		cursor: isPanning ? 'grabbing' : isSpaceDown ? 'grab' : undefined,
	};
};

/**
 *
 * Use this function after the element to reposition the element appropraitely, according the the bounds set to it and whether to prioritize centering the element
 */
const reposition = (params: UseDraggableParams) => {
	const { containerId, contentId, center, boundary } = params;
	const container = document.getElementById(containerId);
	const content = document.getElementById(contentId);
	if (!container || !content) {
		console.warn('Parent or content element not found');
		return;
	}
	const contentRect = getElementPosition(content);
	const containerRect = container.getBoundingClientRect();

	const exceedsHeight = contentRect.height > containerRect.height;
	const exceedsWidth = contentRect.width > containerRect.width;

	const centerY = center === true || (typeof center === 'object' && center.y);
	const centerX = center === true || (typeof center === 'object' && center.x);

	if (!exceedsHeight && centerY) centerVertically({ container, content });
	if (!exceedsWidth && centerX) centerHorizontally({ container, content });

	moveInBoundaries({ containerId, contentId, boundary });
};

/**
 * Determine the initial position of the element, prioritizing centering the element, and applying the boundaries
 * If centering the element makes it so that the upper left hand corner of the element is outside the boundaries, the element will be repositioned to fit within the boundaries
 */
const repositionInitialPosition = async (params: UseDraggableParams) => {
	const { containerId, contentId, boundary } = params;
	const container = document.getElementById(containerId);
	const content = document.getElementById(contentId);
	if (!container || !content) {
		console.warn('Parent or content element not found');
		return;
	}

	centerElement({ container, content });
	const containerRect = container.getBoundingClientRect();

	setElementPosition(content, (prev) => {
		let top = prev.top;
		let left = prev.left;
		const boundaries = dBounds(boundary);
		if (prev.width > containerRect.width) {
			left = boundaries.left ?? 0;
		}
		if (prev.height > containerRect.height) {
			top = boundaries.top ?? 0;
		}
		return { ...prev, left, top };
	});
};

/**
 *
 * Move the element to fit within the boundaries set
 *
 */
const moveInBoundaries = (params: UseDraggableParams) => {
	const { containerId, contentId, boundary } = params;
	const container = document.getElementById(containerId);
	const content = document.getElementById(contentId);
	if (!container || !content) {
		console.warn('Parent or content element not found');
		return;
	}

	const containerRect = container.getBoundingClientRect();
	const contentRect = getElementPosition(content);
	const boundaries = dBounds(boundary);

	setElementPosition(content, (prev) => {
		const hasXBounds = boundaries.left !== undefined && boundaries.right !== undefined;
		const limitLeft_0 = hasXBounds ? containerRect.width - contentRect.width - (boundaries.right ?? 0) : prev.left;
		const limitLeft_1 = hasXBounds ? boundaries.left ?? 0 : prev.left;
		const minLeft = Math.min(limitLeft_0, limitLeft_1);
		const maxLeft = Math.max(limitLeft_0, limitLeft_1);

		const hasYBounds = boundaries.top !== undefined && boundaries.bottom !== undefined;
		const limtTop_0 = hasYBounds ? containerRect.height - contentRect.height - (boundaries.bottom ?? 0) : prev.top;
		const limitTop_1 = hasYBounds ? boundaries.top ?? 0 : prev.top;
		const minTop = Math.min(limtTop_0, limitTop_1);
		const maxTop = Math.max(limtTop_0, limitTop_1);

		const left = Math.min(Math.max(prev.left, minLeft), maxLeft);
		const top = Math.min(Math.max(prev.top, minTop), maxTop);
		return { ...prev, left, top };
	});
};

/**
 *
 * Center the content element vertically within the container element
 * if Provided a target element, the content element will be centered relative to the target element
 * The target Element should be a descendant of the content element
 */
const centerVertically = (params: { container: HTMLElement; content: HTMLElement; target?: HTMLElement }) => {
	const { container, content, target } = params;
	const containerRect = container.getBoundingClientRect();
	const contentRect = getElementPosition(content);
	const targetRect = target ? getElementPosition(target) : contentRect;
	if (target && !content.contains(target)) {
		console.warn('Target element is not a descendant of the content element');
		return;
	}
	const offset = targetRect.y - contentRect.y;
	const top = (containerRect.height - targetRect.height) / 2 - offset;
	setElementPosition(content, { top });
};

/**
 *
 * Center the content element horizontally within the container element
 * if Provided a target element, the content element will be centered relative to the target element
 * The target Element should be a descendant of the content element
 */
const centerHorizontally = (params: { container: HTMLElement; content: HTMLElement; target?: HTMLElement }) => {
	const { container, content, target } = params;
	const containerRect = container.getBoundingClientRect();
	const contentRect = getElementPosition(content);
	const targetRect = target ? getElementPosition(target) : contentRect;
	if (target && !content.contains(target)) {
		console.warn('Target element is not a descendant of the content element');
		return;
	}
	const offset = targetRect.x - contentRect.x;
	const left = (containerRect.width - targetRect.width) / 2 - offset;
	setElementPosition(content, { left });
};

/**
 *
 * Center the content element within the container element
 * if Provided a target element, the content element will be centered relative to the target element
 */
const centerElement = (params: { container: HTMLElement; content: HTMLElement; target?: HTMLElement }) => {
	centerHorizontally(params);
	centerVertically(params);
};
