import { Box, Typography } from '@mui/material';
import { Viewport } from '../../../components';
import { backgroundColor } from '../../../constants';
import './index.css';

export const ViewportComp = () => {
	return (
		<Viewport>
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
				height: '2000px',
				width: '2000px',
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
