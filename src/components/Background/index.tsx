import { Box, styled } from '@mui/material';
import { BorderColor, PanelColor, backgroundColor, lineColor } from '../../constants';

export const Background = styled(Box)({
	overflow: 'hidden',
	color: 'white',
	position: 'fixed',
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	zIndex: -1,
	display: 'flex',
	flexDirection: 'column',
	backgroundImage: `linear-gradient(to right , ${lineColor} 1px, transparent 1px),
    linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
	backgroundSize: '80px 80px',
	backgroundColor: backgroundColor,
	backgroundPosition: '0px 0px',

	'&::before': {
		pointerEvents: 'none',
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		height: '100vh',
		backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px),
        linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
		backgroundSize: '20px 20px',
		backgroundPosition: '0px 0px',
		zIndex: -1,
	},
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
});
