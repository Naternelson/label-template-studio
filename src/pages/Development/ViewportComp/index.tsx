import { Box, Typography } from '@mui/material';
import { Viewport } from '../../../components';
import './index.css';

export const ViewportComp = () => {
	return (
		<Viewport boundary={-1000} >
			<SampleElement />
		</Viewport>
	);
};

const SampleElement = () => {
	return (
		<Box
			sx={{
				boxSizing: 'border-box',
				padding: '1rem',
				color: (t) => t.palette.primary.main,
				backgroundColor: 'white',
				height: '100px',
				width: '100px',
				borderRadius: '10px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				boxShadow: '0 0 10px rgba(0,0,0,.1)',
			}}>
			<Typography variant="caption">Sample Element</Typography>
		</Box>
	);
};
