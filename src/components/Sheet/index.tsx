import { Box, SxProps } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useSheetBackground, useSheetDimensions } from '../../store/sheet/hooks';
import { useGlobalScaleControls } from '../../store/global/hooks';

export const Sheet = (props: { width: string; height: string; backgroundColor: string; backgroundImage?: string }) => {
	const { width, height, backgroundColor, backgroundImage } = props;
	const sx: SxProps = {
		width,
		height,
		backgroundColor,
		backgroundImage,
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		color: 'black',
	};

	return <Box sx={sx}>HELLO WORLD</Box>;
};
const Buffer = 16 * 3;
export const SheetContainer = () => {
	const [mounted, setMounted] = useState(false);
	const scaleControls = useGlobalScaleControls();
	const dimensions = useSheetDimensions();
	const width = dimensions.width.value + 'in';
	const height = dimensions.height.value + 'in';
	const {ref: clientRef, dims: clientDims, setPosition} = useClient({width, height, scale: scaleControls.scale});
	const [parentRef, parentDims] = useParentDims();
	const exceedsParent = useMemo(() => {
		const { width, height } = clientDims;
		const getDim = (value: number) => value + Buffer * 2;
		return {
			exceedsWidth: getDim(width) > parentDims.width,
			exceedsHeight: getDim(height) > parentDims.height,
		};
	}, [clientDims, parentDims]);

	const center = useCentering(parentDims, clientDims);
	const onClick = useCallback(() => {
		const { x, y } = center();
		setPosition({ x, y }, clientRef);
	}, [center, clientRef, setPosition]);

	const centerX = useCenterX(parentDims, clientDims);
	const onClickX = useCallback(() => {
		const x = centerX();
		setPosition((prev) => ({ ...prev, x }), clientRef);
	}, [centerX, clientRef, setPosition]);

	useEffect(() => {
		const { exceedsHeight, exceedsWidth } = exceedsParent;
		if (exceedsHeight && !exceedsWidth) {
			onClickX();
		} else if (!exceedsHeight && !exceedsWidth) {
			onClick();
		}
	}, [exceedsParent, onClick, onClickX]);

	useHandleWheel({ parentRef, exceedsParent, clientDims, parentDims, setPosition, clientRef });
	const { panning } = useHandlePan({ clientRef, parentRef, clientDims, parentDims, exceedsParent });

	return (
		<Box
			sx={{ flex: 1, cursor: panning ? 'grabbing' : 'default', overflow: 'hidden', position: 'relative' }}
			ref={parentRef}
			onDoubleClick={onClick}>
			<Box
				ref={clientRef}
				sx={{
					transitionProperty: 'top, left',
					transitionDuration: panning ? 0 :'.1s',
					transitionTimingFunction: 'ease',
					position: 'absolute',
					scale: `${scaleControls.scale}`,
					transformOrigin: 'top left',
				}}>
				<Sheet width={width} height={height} backgroundColor={'#fff'} />
			</Box>
		</Box>
	);
};

const useClient = (params: { width: string; height: string; scale: number }) => {
	const ref = useRef<HTMLDivElement>(null);
	const setPosition = useCallback(
		(
			params: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number }),
			ref: React.RefObject<HTMLDivElement>,
		) => {
			const el = ref.current;
			if (!el) return;
			const currentX = el.style.left || '0px';
			const currentY = el.style.top || '0px';
			const x = parseInt(currentX);
			const y = parseInt(currentY);
			const newPos = typeof params === 'function' ? params({ x, y }) : params;
			el.style.left = `${newPos.x}px`;
			el.style.top = `${newPos.y}px`;
		},
		[],
	);
	return {
		ref,
		dims: useClientDims(params.width, params.height, params.scale),
		setPosition,
	};
};

const useClientDims = (width: string, height: string, scale: number) => {
	const calculatedDims = useMemo(() => {
		const dummyEl = document.createElement('div');
		dummyEl.style.width = `calc(${width} * ${scale})`;
		dummyEl.style.height = `calc(${height} * ${scale})`;
		document.body.appendChild(dummyEl);
		const calculatedWidth = dummyEl.offsetWidth;
		const calculatedHeight = dummyEl.offsetHeight;
		document.body.removeChild(dummyEl);
		return {
			width: calculatedWidth,
			height: calculatedHeight,
		};
	}, [width, height, scale]);
	return calculatedDims;
};

const useParentDims = () => {
	const ref = useRef<HTMLDivElement>(null);
	const [parentDims, setParentDims] = useState({ width: 0, height: 0 });
	useEffect(() => {
		if (ref.current) {
			const { width, height } = ref.current.getBoundingClientRect();
			setParentDims({ width, height });
		}
	}, []);
	return [ref, parentDims] as const;
};

const useCentering = (parentDims: { width: number; height: number }, clientDims: { width: number; height: number }) => {
	return useCallback(() => {
		const x = (parentDims.width - clientDims.width) / 2;
		const y = (parentDims.height - clientDims.height) / 2;
		return { x, y };
	}, [parentDims, clientDims]);
};

const useCenterX = (parentDims: { width: number; height: number }, clientDims: { width: number; height: number }) => {
	return useCallback(() => {
		const x = (parentDims.width - clientDims.width) / 2;
		return x;
	}, [parentDims, clientDims]);
};

const useHandleWheel = (params: {
	clientRef: React.RefObject<HTMLDivElement>;
	parentRef: React.RefObject<HTMLDivElement>;
	exceedsParent: { exceedsHeight: boolean; exceedsWidth: boolean };
	clientDims: { width: number; height: number };
	parentDims: { width: number; height: number };
	setPosition: ReturnType<typeof useClient>['setPosition'];
}) => {
	const { parentRef, clientRef,  exceedsParent, clientDims, parentDims, setPosition } = params;

	const handleWheel = useCallback(
		(e: WheelEvent) => {
			if (exceedsParent.exceedsHeight) {
				e.preventDefault();
				const MinY = -(clientDims.height - parentDims.height + Buffer);
				const MaxY = Buffer;
				const { deltaY } = e;

				requestAnimationFrame(() => {
					setPosition((prev) => {
						const y = prev.y - deltaY;
						if (y < MinY) return { ...prev, y: MinY };
						if (y > MaxY) return { ...prev, y: MaxY };
						return { ...prev, y };
					}, clientRef);
				});
			}
		},
		[clientDims.height, exceedsParent.exceedsHeight, parentDims.height, setPosition, clientRef],
	);

	useEffect(() => {
		const el = parentRef.current;
		if (!el) return;
		el.addEventListener('wheel', handleWheel, { passive: false });
		return () => {
			el.removeEventListener('wheel', handleWheel);
		};
	}, [handleWheel, parentRef]);

	return null;
};

const useHandlePan = (params: {
	clientRef: React.RefObject<HTMLDivElement>;
	parentRef: React.RefObject<HTMLDivElement>;
	clientDims: { width: number; height: number };
	parentDims: { width: number; height: number };
	exceedsParent: { exceedsHeight: boolean; exceedsWidth: boolean };
}) => {
	const { clientRef, parentRef, clientDims, parentDims, exceedsParent } = params;
	const [panning, setPanning] = useState(false);
	const startX = useRef(0);
	const startY = useRef(0);
	const animationFrameId = useRef<number | null>(null);

	const handleMouseDown = useCallback((e: MouseEvent) => {
		if (e.button === 1) {
			e.preventDefault();
			setPanning(true);
			startX.current = e.clientX;
			startY.current = e.clientY;
		}
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (panning) {
				e.preventDefault();
				const deltaX = e.clientX - startX.current;
				const deltaY = e.clientY - startY.current;
				startX.current = e.clientX;
				startY.current = e.clientY;

				if (animationFrameId.current) {
					cancelAnimationFrame(animationFrameId.current);
				}
				const el = clientRef.current;
				if (!el) return;
				const updatePosition = () => {
					const MinX = -(clientDims.width - parentDims.width + Buffer);
					const MaxX = Buffer;
					const MinY = -(clientDims.height - parentDims.height + Buffer);
					const MaxY = Buffer;
					const currentTop = el.style.top || '0px';
					const currentLeft = el.style.left || '0px';
					const y = parseInt(currentTop) + deltaY;
					const x = parseInt(currentLeft) + deltaX;

					const boundedX = Math.min(Math.max(x, MinX), MaxX);
					const boundedY = Math.min(Math.max(y, MinY), MaxY);
					if (exceedsParent.exceedsHeight && exceedsParent.exceedsWidth) {
						el.style.top = `${boundedY}px`;
						el.style.left = `${boundedX}px`;
					} else if (exceedsParent.exceedsHeight) {
						el.style.top = `${boundedY}px`;
					} else if (exceedsParent.exceedsWidth) {
						el.style.left = `${boundedX}px`;
					} else {
						el.style.top = `${Buffer}px`;
						el.style.left = `${Buffer}px`;
					}
					console.log('x', x, 'y', y, 'boundedX', boundedX, 'boundedY', boundedY);
				};
				animationFrameId.current = requestAnimationFrame(updatePosition);
			}
		},
		[
			panning,
			clientRef,
			clientDims.width,
			clientDims.height,
			parentDims.width,
			parentDims.height,
			exceedsParent.exceedsHeight,
			exceedsParent.exceedsWidth,
		],
	);

	const handleMouseUp = useCallback(() => {
		setPanning(false);
		if (animationFrameId.current) {
			cancelAnimationFrame(animationFrameId.current);
		}
	}, []);

	useEffect(() => {
		const el = parentRef.current;
		if (!el) return;
		el.addEventListener('mousedown', handleMouseDown);
		el.addEventListener('mousemove', handleMouseMove);
		el.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			el.removeEventListener('mousedown', handleMouseDown);
			el.removeEventListener('mousemove', handleMouseMove);
			el.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [handleMouseDown, handleMouseMove, handleMouseUp, parentRef]);

	return { panning };
};
