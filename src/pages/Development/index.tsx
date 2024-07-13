import { Box, SpeedDial, SpeedDialIcon } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

export const DevLayout = () => {

	return (
		<Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Outlet />
			<Links />
		</Box>
	);
};

const Links = () => {
	const nav = useNavigate();
	const toHome = () => {
		nav('/');
	};
	const toDev = () => {
		nav('/dev');
	};
	const toViewport = () => {
		nav('/dev/viewport');
	};
	const actions = [];
	return (
		<SpeedDial sx={{ position: 'fixed', bottom: 16, right: 16 }} ariaLabel="Links" icon={<SpeedDialIcon />}>
			Hi there
		</SpeedDial>
	);
};
