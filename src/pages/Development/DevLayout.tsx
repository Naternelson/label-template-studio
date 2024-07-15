import { Box, Button, ClickAwayListener, Collapse, Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const DevLayout = () => {
	return (
		<Box sx={{ display: "flex", height: '100vh', padding: '2rem 2rem', backgroundColor: '#B0E0E6' }}>
			<Paper elevation={10} sx={{flex: 1, overflow: "auto", display: 'flex'}}>
				<Outlet />
			</Paper>
			<Links />
		</Box>
	);
};

const Links = () => {
	const [open, setOpen] = useState(false);
	const nav = useNavigate();
	const handleLinkto = (path: string) => () => {
		nav(path);
		handleClose();
	};

	const actions = [
		{
			label: 'Home',
			onClick: handleLinkto('/'),
		},
		{
			label: 'Dev',
			onClick: handleLinkto('/dev'),
		},
		{
			label: 'Viewport',
			onClick: handleLinkto('/dev/viewport'),
		},
	];
	const handleClose = () => setOpen(false);
	const handleToggle = () => setOpen((prevOpen) => !prevOpen);
	return (
		<ClickAwayListener onClickAway={handleClose}>
			<Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
				<Collapse in={open}>
					<Stack direction={'column'} spacing={1}>
						{actions.map((action, index) => (
							<Button
								key={index}
								onClick={action.onClick}
								sx={{ my: 1 }}
								variant="contained"
								color="primary">
								{action.label}
							</Button>
						))}
					</Stack>
				</Collapse>

				<Button onClick={handleToggle} fullWidth>
					DEV
				</Button>
			</Box>
		</ClickAwayListener>
	);
};
