import { Box, Grid, alpha, useTheme } from '@mui/material';
import { Sheet } from '../../store/sheet';
import { Border, Padding } from '../../types';
import { GlobalState } from '../../store/global';
import { useSheetIndex } from '../../store/sheet/hooks';

export type LabelProps = {
	width: number;
	height: number;
	unit: GlobalState['unit'];
	padding: Padding;
	border: Border;
	index: number;
	color: string;
};

export const Label = (props: LabelProps) => {
	const { padding, unit, border, index, height, width, color: backgroundColor } = props;
	const theme = useTheme();
	const color = theme.palette.primary.main;
	const { currentLabelIndex, updateLabelIndex } = useSheetIndex();
	const selected = currentLabelIndex === index;
	const handleOnClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (selected) return;
		updateLabelIndex(index);
	};
	return (
		<Box
			zIndex={selected ? 101 : 0}
			aria-label="template-label"
			onClick={handleOnClick}
			data-focused={selected ? 'true' : 'false'}
			data-index={index}
			sx={{
				boxSizing: 'border-box',
				backgroundColor: "blue",
				height: `${height}${unit}`,
				width: `${width}${unit}`,
				padding: `${padding.paddingTop}${unit} ${padding.paddingRight}${unit} ${padding.paddingBottom}${unit} ${padding.paddingLeft}${unit}`,
				border: `${border.borderWidth}${unit} ${border.borderStyle} ${border.borderColor}`,
				position: 'relative',
				boxShadow: 'none',
				outline: 'none',
				transition: 'box-shadow 0.3s',
				"&[data-focused='true']": {
					boxShadow: `0 0 40px 10px ${alpha(color, 0.7)}`,
				},
			}}>
			Hi there
		</Box>
	);
};
