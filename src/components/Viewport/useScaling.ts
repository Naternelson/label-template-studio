import { useCallback, useEffect, useState } from 'react';
import { Boundary, dBounds, getElementPosition, setElementPosition } from './util';

export const useScaling = (props: {
	disabled?: boolean;
	containerId: string;
	contentId: string;
	boundary: number | Boundary;
}) => {
	const { disabled, containerId, contentId, boundary } = props;
	/**
	 * Handle wheel events
	 */

	const [isCtrlDown, setIsCtrlDown] = useState(false);

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === 'Control') {
			setIsCtrlDown(true);
		}
	},[]);
	const handleKeyUp = useCallback((e: KeyboardEvent) => {
		if (e.key === 'Control') {
			setIsCtrlDown(false);
		}
	},[]);
	const handleWheel = useCallback(
		(el: HTMLElement) => (e: WheelEvent) => {
			if (disabled || isCtrlDown) return;

			const dy = e.deltaY * 0.5;

			setElementPosition(el, (prev) => {
				let newTop = prev.top - dy;

				// Apply vertical boundary restrictions
				const container = document.getElementById(containerId);
				if (!container) return prev;
				const containerRect = container.getBoundingClientRect();
				const elPosition = getElementPosition(el);
				const boundaries = dBounds(boundary);

				const minTop =
					boundaries.bottom !== undefined
						? containerRect.height - elPosition.height - boundaries.bottom
						: newTop;
				const maxTop = boundaries.top !== undefined ? boundaries.top : newTop;
				newTop = Math.min(Math.max(newTop, minTop), maxTop);

				return { ...prev, top: newTop };
			});
		},
		[disabled, isCtrlDown, containerId, boundary],
	);

	useEffect(() => {
		const container = document.getElementById(containerId);
		const el = document.getElementById(contentId);
		if (!container || !el) return;
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		container.addEventListener('wheel', handleWheel(el));
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
			container.removeEventListener('wheel', handleWheel(el));
		};
	}, [containerId, contentId, handleWheel, handleKeyDown, handleKeyUp]);
};
