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
	let scale: number;
	if (scaleEl) {
		scale = scaleEl.style.transform ? parseFloat(scaleEl.style.transform.split('(')[1]) : 1;
	} else {
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
}
