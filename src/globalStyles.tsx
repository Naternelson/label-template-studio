import { GlobalStyles, alpha } from '@mui/material';

export const globalStyles = (
	<GlobalStyles
		styles={(theme) => ({
			'@keyframes focus-highlight': {
				'0%': {
                    
					// border: `1px solid white`,
					// boxShadow: `0 0 5px 2px rgba(255, 255, 255, 1), 0 0 10px 5px ${alpha(
					// 	theme.palette.primary.main,
					// 	0.7,
					// )}`,
					transform: 'scale(1.05)',
				},
				'100%': {
					// border: `1px solid ${theme.palette.primary.main}`,
					// boxShadow: `0 0 5px 2px rgba(255, 255, 255, 0), 0 0 10px 5px ${alpha(
					// 	theme.palette.primary.main,
					// 	0,
					// )}`,
					transform: 'scale(1)',
				},
			},
			'@keyframes focus-glow': {
				'0%': {
					opacity: 0.5,
				},
				'100%': {
					opacity: 0,
				},
			},
			'.focus-highlight': {
				position: 'relative',
				animation: 'focus-highlight 0.3s forwards ease-in-out',
			},
			'.focus-highlight::after': {
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				background: 'white',
				animation: 'focus-glow 0.3s forwards ease-in-out',
			},
		})}
	/>
);
