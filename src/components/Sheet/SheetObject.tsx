import { Box, alpha, useTheme } from '@mui/material';
import { useSheetBackground, useSheetDims, useSheetIndex, useSheetPadding } from '../../store/sheet/hooks';
import { useEffect, useRef, useState } from 'react';
import { Label } from '../Label';
import { SheetLabels } from '../SheetLabels';

const buffer = '5rem';

export const SheetObject = () => {
	const { updateLabelIndex } = useSheetIndex();
	const ref = useRef<HTMLDivElement>(null);
	const dims = useSheetDims();
	const padding = useSheetPadding();
	const background = useSheetBackground();
	const top = useCalcuatedTop(ref, dims, buffer);

	const paddingX = `calc(${buffer} * 2)`;
	const handleOnClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		updateLabelIndex(undefined);
	};
	const color = useTheme().palette.primary.main;
	return (
		<Box
			ref={ref}
			sx={{
				visibility: top === undefined ? 'hidden' : 'visible',
				padding: buffer,
				position: 'relative',
				marginX: 'auto',
				top,
				width: `calc(${dims.scaled.width}${dims.unit} + ${paddingX})`,
			}}>
			<Box
				onClick={handleOnClick}
				sx={{
					padding: `${padding.scaled.top}${dims.unit} ${padding.scaled.right}${dims.unit} ${padding.scaled.bottom}${dims.unit} ${padding.scaled.left}${dims.unit}`,
					display: 'flex',
					"&:hover [aria-label='label']::after": {
						border: `2px solid ${alpha(color, 0.3)}`,
					},
					width: `${dims.scaled.width}${dims.unit}`,
					height: `${dims.scaled.height}${dims.unit}`,
					backgroundColor: background.color,
					borderRadius: '2px',
					boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
					color: 'black',
				}}>
				<SheetLabels />
			</Box>
		</Box>
	);
};

const useCalcuatedTop = (
	ref: React.RefObject<HTMLDivElement>,
	dims: ReturnType<typeof useSheetDims>,
	buffer: string,
) => {
	const [top, setTop] = useState<string | undefined>(undefined);
	useEffect(() => {
		const r = ref.current;
		if (!r) return;
		const recaluclate = () => {
			const pHeight = r.parentElement?.clientHeight || 0;
			const paddingY = `calc(${buffer} * 2)`;
			const elementHeight = `calc(${dims.scaled.height}${dims.unit} + ${paddingY})`;
			let topValue = `calc((${pHeight}px - ${elementHeight}) / 2)`;

			const tempDiv = document.createElement('div');
			tempDiv.style.position = 'absolute';
			tempDiv.style.top = topValue;
			document.body.appendChild(tempDiv);
			const calculatedTop = parseFloat(getComputedStyle(tempDiv).top);
			document.body.removeChild(tempDiv);

			if (calculatedTop < 0) {
				topValue = '0';
			}
			setTop(topValue);
		};
		recaluclate();
		// Listen for when the window is resized

		window.addEventListener('resize', recaluclate);
		return () => {
			window.removeEventListener('resize', recaluclate);
		};
	}, [buffer, dims.scaled.height, dims.unit, ref]);

	return top;
};
