import { Box, Typography, styled } from '@mui/material';
import { BorderColor, PanelColor } from '../../constants';
import { useContainerHooks } from './useHooks';
import { Sheet } from '../Sheet';
import { useTemplateSelector } from '../../store';
import { useEffect, useRef, useState } from 'react';

export const SheetContainer = () => {
	const { height, width } = useContainerHooks();
	return (
		<Container id="sheet-container">
			<ScaleIndicator />

			<SheetWrapper
				sx={{
					width: `calc(${width} + 10rem)`,
					height: `calc(${height} + 10rem)`,
					transition: 'all .1s ease',
				}}>
				<Sheet />
			</SheetWrapper>
		</Container>
	);
};

const Container = styled(Box)(() => ({
	// position: 'relative',
	overflow: 'auto',
	maxWidth: '100%',
	width: '100%',
	height: '100%',
	minHeight: '0px',
	scrollbarColor: `${BorderColor} ${PanelColor}`,
	scrollbarWidth: 'thin',
	'&::-webkit-scrollbar': {
		width: '12px',
		height: '12px',
	},
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: BorderColor,
		borderRadius: '6px',
		border: `3px solid ${PanelColor}`,
	},
	'&::-webkit-scrollbar-track': {
		backgroundColor: PanelColor,
		borderRadius: '6px',
	},
}));

const SheetWrapper = styled(Box)(() => ({
	justifyContent: 'center',
	alignItems: 'center',
	minWidth: '100%',
	minHeight: '100%',
	display: 'flex',
	position: 'relative',
}));

const ScaleIndicator = () => {
	const mounted = useRef(false);
	const [show, setShow] = useState(false);
	const scale = useTemplateSelector((s) => s.sheet.scale);
	const renderScale = Math.round(scale * 100) + '%';
	const [top, setTop] = useState(0);
	const [left, setLeft] = useState(0);

	useEffect(() => {
		if (mounted.current === false) {
			mounted.current = true;
			return;
		}
		setShow(true);
		const timeout = setTimeout(() => {
			setShow(false);
		}, 5000);
		return () => clearTimeout(timeout);
	}, [scale]);

	useEffect(() => {
		const position = () => {
			const el = document.getElementById('sheet-container');
			if (el) {
				setTop(el.offsetTop);
				setLeft(el.offsetLeft + el.clientWidth);
			}
		};
		window.addEventListener('resize', position);
		position();
		return () => window.removeEventListener('resize', position);
	}, []);

	return (
		<Box
			sx={{
				position: 'fixed',
				right: `calc(100vw - ${left}px)`,
				top,
				padding: '1rem',
				opacity: show ? 1 : 0,
				transition: 'opacity 0.2s ease',
				pointerEvents: 'none',
				color: 'rgba(255,255,225,.8)',
			}}>
			<Typography variant="caption">{renderScale}</Typography>
		</Box>
	);
};
