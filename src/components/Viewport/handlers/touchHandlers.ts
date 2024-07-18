import {  useCallback, useRef, useState } from 'react';
import { Boundary, Center, reposition, setElementPosition } from "../util"

type useTouchHandlersParams = {
    contentId: string;
    containerId: string;
    center: Center | undefined;
    boundary: Boundary | undefined;
    disabled: boolean | undefined;
}
export const useTouchHandlers = (params: useTouchHandlersParams) => {
    const { contentId, containerId, center, boundary, disabled } = params;
    const startX = useRef<number>(0);
    const startY = useRef<number>(0);
    const [panning, setPanning] = useState<boolean>(false);

    const getElements = useCallback(() => {
        const container = document.getElementById(containerId);
        const content = document.getElementById(contentId);
        if (!container || !content) {
            console.warn('Parent or content element not found');
            return null;
        }
        return { container, content };
    }, [containerId, contentId]);

    const handleTouchStart = useCallback(
        (e: TouchEvent) => {
            if (disabled) return;
            const touch = e.touches[0];
            if (touch) {
                setPanning(true);
                startX.current = touch.clientX;
                startY.current = touch.clientY;
            }
        },
        [disabled]
    );

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (!panning) return;
            const touch = e.touches[0];
            if (touch) {
                e.preventDefault();
                const dx = touch.clientX - startX.current;
                const dy = touch.clientY - startY.current;

                setElementPosition(document.getElementById(contentId) as HTMLElement, (prev) => ({
                    ...prev,
                    left: prev.left + dx,
                    top: prev.top + dy,
                }));

                startX.current = touch.clientX;
                startY.current = touch.clientY;
            }
        },
        [panning, contentId]
    );

    const handleTouchEnd = useCallback(() => {
        if (setPanning) {
            reposition({ containerId, contentId, center, boundary });
            setPanning(false);
        }
    }, [setPanning, containerId, contentId, center, boundary]);

    const attachListeners = useCallback(() => {
        const { container } = getElements() || {};
        if (!container) return () => { };
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchmove', handleTouchMove);
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [getElements, handleTouchStart, handleTouchMove, handleTouchEnd]);

    return { attachListeners, panning, setPanning };
}
