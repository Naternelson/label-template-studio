import { createTheme } from '@mui/material';

export const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#f44336',
		},
		secondary: {
			main: '#3f51b5',
		},
		text: {
			primary: '#ffffff',
			secondary: '#ffffff',
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
				},
			},
		},
	},
});
