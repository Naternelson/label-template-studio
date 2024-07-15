import { Box, Typography } from '@mui/material';
import { Viewport } from '../../../components';
import './index.css';

export const ViewportComp = () => {
	return (
		<Viewport boundary={50}>
			<SampleElement />
		</Viewport>
	);
};

const SampleElement = () => {
	return (
		<Box
			sx={{
				color: (t) => t.palette.primary.main,
				backgroundColor: 'white',
				height: '200px',
				width: '200px',
				borderRadius: '10px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 0 10px rgba(0,0,0,.1)',
			}}>
			<Typography variant="h6">Sample Element</Typography>
		</Box>
	);
};
