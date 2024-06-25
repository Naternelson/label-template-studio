import { Box, styled } from '@mui/material';
import { useTemplateSelector } from '../../store';
import { useClientSelector } from '../../utility';
import { MarginIndicators } from './MarginIndicators';

export const Sheet = () => {
	const sx = useSheetHooks();
	return (
		<StyledSheet
			id="sheet"
			sx={{
				...sx,
				position: 'relative',
				transition: 'all .1s ease',
				overflow: 'hidden',
				textWrap: 'nowrap',
			}}>
			Hello World
			<MarginIndicators />
		</StyledSheet>
	);
};

const StyledSheet = styled(Box)(({ theme }) => ({
	color: 'black',
	backgroundColor: 'white',
	boxShadow: theme.shadows[3],
}));

const useSheetHooks = () => {
	const backgroundColor = useTemplateSelector((s) => s.sheet.background.color);
	const width = useClientSelector((s) => s.sheet.dimensions.width);
	const height = useClientSelector((s) => s.sheet.dimensions.height);
	const paddingTop = useClientSelector((s) => s.sheet.padding.paddingTop);
	const paddingRight = useClientSelector((s) => s.sheet.padding.paddingRight);
	const paddingBottom = useClientSelector((s) => s.sheet.padding.paddingBottom);
	const paddingLeft = useClientSelector((s) => s.sheet.padding.paddingLeft);
	const scale = useTemplateSelector((s) => s.sheet.scale);
	return {
		backgroundColor,
		width: calc(width, scale),
		height: calc(height, scale),
		paddingTop: calc(paddingTop, scale),
		paddingRight: calc(paddingRight, scale),
		paddingBottom: calc(paddingBottom, scale),
		paddingLeft: calc(paddingLeft, scale),
	};
};

const calc = (value: string, scale: number) => {
	return `calc(${value} * ${scale})`;
};
