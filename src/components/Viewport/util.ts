export type Position = {
	top: number;
	left: number;
	scale: number;
	width: number;
	height: number;
    x: number;
    y: number;
};

/**
 *
 * @param element
 * @returns Returns the position of the element, with the scale applied to the width and height
 */
export function getElementPosition(element: HTMLElement, scaleEl?: HTMLElement): Position {
	const rect = element.getBoundingClientRect();
	let  scale: number;
    if(scaleEl){
        scale = scaleEl.style.transform ? parseFloat(scaleEl.style.transform.split('(')[1]) : 1;
    }
    else{
        scale = element.style.transform ? parseFloat(element.style.transform.split('(')[1]) : 1;
    }
	const width = rect.width * scale;
	const height = rect.height * scale;
	const left = element.style.left ? parseInt(element.style.left) : 0;
	const top = element.style.top ? parseInt(element.style.top) : 0;

	return { top, left, scale, width, height, x: rect.x, y: rect.y };
}

export function setElementPosition(
	element: HTMLElement,
	option: Partial<Position> | ((previous: Position) => Partial<Position>),
) {
	const { top, left, scale = 1 } = typeof option === 'function' ? option(getElementPosition(element)) : option;

	if (top !== undefined) element.style.top = `${top}px`;
	if (left !== undefined) element.style.left = `${left}px`;
	if (scale !== undefined) element.style.transform = `scale(${scale})`;
	console.log({ top, left, scale });
}

export type Boundary = {
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
	x?: number;
	y?: number;
};

export const centerElementVertically = (params: {
	targetEl: HTMLElement;
	parentEl: HTMLElement;
	boundary?: number | Boundary;
}) => {
	const { targetEl, parentEl, boundary } = params;
	const parent = parentEl.getBoundingClientRect();
	const s = targetEl.style.transform ? parseFloat(targetEl.style.transform.split('(')[1]) : 1;
	const target = {
		top: targetEl.style.top ? parseInt(targetEl.style.top) : 0,
		left: targetEl.style.left ? parseInt(targetEl.style.left) : 0,
		height: scale(s, targetEl.getBoundingClientRect().height),
		width: scale(s, targetEl.getBoundingClientRect().width),
	};
	const bounds = dBounds(boundary);
	const maxTop = boundary ? parent.height - target.height - (bounds.bottom || 0) : null;
	const minTop = boundary ? bounds.top || 0 : null;
	const newTop = (parent.height - target.height) / 2;
	const top = Math.min(Math.max(newTop, minTop || newTop), maxTop || newTop);
	targetEl.style.top = `${top}px`;
};

export const centerElementHorizontally = (params: {
	targetEl: HTMLElement;
	parentEl: HTMLElement;
	boundary?: number | Boundary;
}) => {
	const { targetEl, parentEl, boundary } = params;
	const parent = parentEl.getBoundingClientRect();
	const s = targetEl.style.transform ? parseFloat(targetEl.style.transform.split('(')[1]) : 1;
	const target = {
		top: targetEl.style.top ? parseInt(targetEl.style.top) : 0,
		left: targetEl.style.left ? parseInt(targetEl.style.left) : 0,
		height: scale(s, targetEl.getBoundingClientRect().height),
		width: scale(s, targetEl.getBoundingClientRect().width),
	};
	const bounds = dBounds(boundary);
	const maxLeft = boundary ? parent.width - target.width - (bounds.right || 0) : null;
	const minLeft = boundary ? bounds.left || 0 : null;
	const newLeft = (parent.width - target.width) / 2;
	const left = Math.min(Math.max(newLeft, minLeft || newLeft), maxLeft || newLeft);
	targetEl.style.left = `${left}px`;
};

export const centerElement = (params: {
	targetEl: HTMLElement;
	parentEl: HTMLElement;
	boundary?: number | Boundary;
}) => {
	const { targetEl, parentEl, boundary } = params;
	const parent = parentEl.getBoundingClientRect();
	const s = targetEl.style.transform ? parseFloat(targetEl.style.transform.split('(')[1]) : 1;
	const target = {
		top: targetEl.style.top ? parseInt(targetEl.style.top) : 0,
		left: targetEl.style.left ? parseInt(targetEl.style.left) : 0,
		height: scale(s, targetEl.getBoundingClientRect().height),
		width: scale(s, targetEl.getBoundingClientRect().width),
	};
	const bounds = dBounds(boundary);
	const maxTop = boundary ? parent.height - target.height - (bounds.bottom || 0) : null;
	const minTop = boundary ? bounds.top || 0 : null;
	const newTop = (parent.height - target.height) / 2;
	const top = Math.min(Math.max(newTop, minTop || newTop), maxTop || newTop);
	targetEl.style.top = `${top}px`;
	const maxLeft = boundary ? parent.width - target.width - (bounds.right || 0) : null;
	const minLeft = boundary ? bounds.left || 0 : null;
	const newLeft = (parent.width - target.width) / 2;
	const left = Math.min(Math.max(newLeft, minLeft || newLeft), maxLeft || newLeft);
	targetEl.style.left = `${left}px`;
};

const scale = (scale: number, property?: number) => {
	return property ? property * scale : 0;
};

export const dBounds = (boundary: number | Boundary | undefined) => {
	const boundaries =
		typeof boundary === 'number'
			? { top: boundary, left: boundary, right: boundary, bottom: boundary }
			: {
					top: boundary?.top ?? boundary?.y,
					left: boundary?.left ?? boundary?.x,
					right: boundary?.right ?? boundary?.x,
					bottom: boundary?.bottom ?? boundary?.y,
			  };
	return boundaries;
};
