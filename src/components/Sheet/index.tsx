import { Box, styled } from '@mui/material';
import { useTemplateSelector } from '../../store';
import { useClientSelector } from '../../utility';
import { MarginIndicators } from './MarginIndicators';
import SheetLabels from '../SheetLabels';

export const Sheet = () => {
	const sx = useSheetHooks();
	return (
		<StyledSheet
			id="sheet"
			sx={{
				...sx,
				position: 'relative',
				transition: 'all .1s ease',
				// overflow: 'hidden',
				textWrap: 'nowrap',
			}}>
			<SheetLabels />
			<MarginIndicators />
			<Overlay />
		</StyledSheet>
	);
};


const Overlay: React.FC = () => {
	const currentLabelIndex = useTemplateSelector((s) => s.sheet.currentLabelIndex);

	return (
		<Box
			sx={{
				transition: 'all .3s ease',
				opacity: currentLabelIndex === undefined ? 0 : 1,
				backgroundColor: 'rgba(128, 128, 128, 0.15)',
				pointerEvents: 'none',
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				zIndex: 500,
				backdropFilter: 'blur(1px)',
			}}
		/>
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
