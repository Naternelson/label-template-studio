import React, { useEffect, useState } from 'react';
import { Box, Tooltip, alpha, useTheme } from '@mui/material';
import { useTemplateSelector } from '../../store';
import { useClientSelector } from '../../utility';

interface MarginIndicatorProps {
	position: 'top' | 'bottom' | 'left' | 'right';
	paddingSelector: Parameters<typeof useClientSelector>[0];
	tooltipPlacement: 'top' | 'bottom' | 'left' | 'right';
	inputSelector: string;
}

const MarginIndicator: React.FC<MarginIndicatorProps> = ({
	position,
	paddingSelector,
	tooltipPlacement,
	inputSelector,
}) => {
	const [show, setShow] = useState(false);
	const padding = useClientSelector(paddingSelector);
	const { paddingLeft, paddingRight, paddingTop, paddingBottom } = useTemplateSelector(
		(state) => state.sheet.padding,
	);
	const scale = useTemplateSelector((s) => s.sheet.scale);
	const backgroundColor = useTheme().palette.info.main;
	const onClick = () => {
		const el = document.querySelector(`${inputSelector} input`) as HTMLInputElement;
		if (el) {
			el.focus();
			el.select();
		}
	};

	useEffect(() => {
		setShow(true);
		const timer = setTimeout(() => {
			setShow(false);
		}, 2000);
		return () => clearTimeout(timer);
	}, [paddingLeft, paddingRight, paddingTop, paddingBottom]);

	const positionStyles = {
		top: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: calc(padding, scale),
		},
		bottom: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			height: calc(padding, scale),
		},
		left: {
			position: 'absolute',
			top: 0,
			left: 0,
			bottom: 0,
			width: calc(padding, scale),
		},
		right: {
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			width: calc(padding, scale),
		},
	};

	return (
		<Tooltip arrow title={padding} placement={tooltipPlacement}>
			<Box
				onDoubleClick={onClick}
				sx={{
					border: `2px solid transparent`,
					transition: 'all .1s ease',
					backgroundColor: alpha(backgroundColor, 0.5),
					backgroundImage: `radial-gradient(${alpha(backgroundColor, 0.5)} 1px, transparent 1px)`,
					backgroundSize: '10px 10px',
					opacity: show ? 1 : 0,
					'&:hover': {
						opacity: 1,
						border: (t) => `2px solid ${t.palette.info.main}`,
					},
					...positionStyles[position],
				}}
			/>
		</Tooltip>
	);
};

const calc = (value: string, scale: number) => {
	return `calc(${value} * ${scale})`;
};

export const MarginIndicators = () => {
	return (
		<>
			<MarginIndicator
				position="top"
				paddingSelector={(s) => s.sheet.padding.paddingTop}
				tooltipPlacement="top"
				inputSelector="#margin-top-control"
			/>
			<MarginIndicator
				position="bottom"
				paddingSelector={(s) => s.sheet.padding.paddingBottom}
				tooltipPlacement="bottom"
				inputSelector="#margin-bottom-control"
			/>
			<MarginIndicator
				position="left"
				paddingSelector={(s) => s.sheet.padding.paddingLeft}
				tooltipPlacement="left"
				inputSelector="#margin-left-control"
			/>
			<MarginIndicator
				position="right"
				paddingSelector={(s) => s.sheet.padding.paddingRight}
				tooltipPlacement="right"
				inputSelector="#margin-right-control"
			/>
		</>
	);
};
