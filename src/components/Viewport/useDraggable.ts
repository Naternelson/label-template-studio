import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { setElementPosition, getElementPosition, dBounds, Boundary, Center } from './util';


export type UseDraggableParams = {
	containerId: string;
	contentId: string;
	disabled?: boolean;
	boundary?: Boundary;
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
		let isMounted = true;
		console.group("Initialising 'useDraggable'");
		(async () => {
			setIsPanning(true);
			await repositionInitialPosition(params);
			if (isMounted) setIsPanning(false);
			console.groupEnd();
		})();
		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		isPanning,
		isSpaceDown,
		cursor: isPanning ? 'grabbing' : isSpaceDown ? 'grab' : undefined,
	};
};

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
	console.log({
		content: { position: getElementPosition(content), bounds: dBounds(boundary) },
		container: {
			width: containerRect.width,
			height: containerRect.height,
			bounds: dBounds(boundary),
		},
	});
	console.log('Yo');

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
		const limitTop_0 = hasYBounds ? containerRect.height - contentRect.height - (boundaries.bottom ?? 0) : prev.top;
		const limitTop_1 = hasYBounds ? boundaries.top ?? 0 : prev.top;
		const minTop = Math.min(limitTop_0, limitTop_1);
		const maxTop = Math.max(limitTop_0, limitTop_1);

		const left = Math.min(Math.max(prev.left, minLeft), maxLeft);
		const top = Math.min(Math.max(prev.top, minTop), maxTop);
		return { ...prev, left, top };
	});
};

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

const centerElement = (params: { container: HTMLElement; content: HTMLElement; target?: HTMLElement }) => {
	centerHorizontally(params);
	centerVertically(params);
};

export const useCenterContent = (params: {
	containerId: string;
	contentId: string;
	center?: Center;
	target?: string;
}) => {
	const { containerId, contentId, center, target: targetId } = params;
	return useCallback(() => {
		const content = document.getElementById(contentId);
		const container = document.getElementById(containerId);
		const target = targetId ? document.getElementById(targetId) : content;
		if (!content || !container || !target) {
			console.warn('Parent or content element not found');
			return;
		}
		if (typeof center === 'object') {
			if (center.x) centerHorizontally({ container, content, target });
			if (center.y) centerVertically({ container, content, target });
		} else
			centerElement({
				container,
				content,
				target,
			});
	}, [center, containerId, contentId, targetId]);
};
