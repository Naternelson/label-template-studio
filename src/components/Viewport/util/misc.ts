import { useCallback } from 'react';
import { Boundary, Center, UseDraggableParams } from './types';
import { centerElement, centerHorizontally, centerVertically } from './reposition';

export const dBounds = (boundary: Boundary | undefined) => {
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

export const sanitizeParams = (params: UseDraggableParams) => {
	const { boundary: b, center: c } = params;
	const center = typeof c === 'object' ? c : { x: c, y: c };
	const boundary = dBounds(b);
	return { ...params, center, boundary };
}


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
