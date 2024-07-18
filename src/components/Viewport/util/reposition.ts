import { dBounds } from "./misc";
import { getElementPosition, setElementPosition } from "./position";
import { UseDraggableParams } from "./types";

export const reposition = (params: UseDraggableParams) => {
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

export const repositionInitialPosition = async (params: UseDraggableParams) => {
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
	moveInBoundaries({ containerId, contentId, boundary });
};

export const moveInBoundaries = (params: UseDraggableParams) => {
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

export const centerVertically = (params: { container: HTMLElement; content: HTMLElement; target?: HTMLElement }) => {
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

export const centerHorizontally = (params: { container: HTMLElement; content: HTMLElement; target?: HTMLElement }) => {
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

export const centerElement = (params: { container: HTMLElement; content: HTMLElement; target?: HTMLElement }) => {
	centerHorizontally(params);
	centerVertically(params);
};
