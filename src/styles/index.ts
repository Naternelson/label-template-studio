import { CSSObject } from '@mui/material';
import { backgroundColor, lineColor } from '../constants';

export const pseudoOverlay: CSSObject = {
	content: '""',
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
};

export const gridDarkStyle: CSSObject = {
	position: 'relative',
	color: 'white',
	backgroundColor,
	'&::before': {
		...pseudoOverlay,
		pointerEvents: 'none',
		backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px),
			linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
		backgroundSize: '80px 80px',
		backgroundPosition: '0px 0px',
	},
	'&::after': {
		...pseudoOverlay,
		pointerEvents: 'none',
		backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px),
			linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
		backgroundSize: '20px 20px',
		backgroundPosition: '0px 0px',
	},
};
