import { Box, InputBase, Stack, Tooltip, useTheme } from '@mui/material';
import { PropertyInputProps, usePropertyInput } from './useHooks';

export const PropertyInput = (props: PropertyInputProps) => {
	const { input, label, onClick } = usePropertyInput(props);

	const borderColor = useTheme().palette.primary.main;

	return (
		<Stack
			onClick={onClick}
			direction={'row'}
			alignItems={'center'}
			sx={{
				border: '1px solid transparent',
				'&:hover': {
					border: '1px solid rgba(255,255,255,.5)',
				},
				'&:focus-within': {
					border: `1px solid ${borderColor}`,
				},
			}}>
			<Tooltip arrow title={props.tooltip || ''}>
				<Box
					component="span"
					sx={{
						padding: '8px',
						opacity: '.7',
						height: '32px',
						fontSize: '11px',
						alignItems: 'center',
						textAlign: 'left',
						userSelect: 'none',
					}}>
					{label}
				</Box>
			</Tooltip>
			<InputBase sx={{ fontSize: (t) => t.typography.caption.fontSize }} {...input} />
		</Stack>
	);
};
