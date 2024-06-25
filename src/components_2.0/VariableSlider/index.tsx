import { Box, InputBase, Stack, Tooltip, useTheme } from '@mui/material';
import { VariableSliderProps, useVariabelSlider } from './usehooks';

export const VariableSlider = (props: VariableSliderProps) => {
	const { input, label, mouseDown } = useVariabelSlider(props);

	const borderColor = useTheme().palette.primary.main;
	const border = mouseDown ? `1px solid ${borderColor}` : '1px solid transparent';

	return (
		<Stack
			id={props.id}
			direction={'row'}
			alignItems={'center'}
			sx={{
				border,
				'&:hover': {
					border: mouseDown ? border : '1px solid rgba(255,255,255,.5)',
				},
				'&:focus-within': {
					border: (t) => `1px solid ${t.palette.primary.main}`,
				},
			}}>
			<Tooltip arrow title={props.tooltip || ''}>
				<Box
					{...label}
					component="span"
					sx={{
						opacity: '.7',
						cursor: 'w-resize',
						width: '100px',
						height: '32px',
						lineHeight: '32px',
						fontSize: '11px',
						flexBasis: '32px',
						alignItems: 'center',
						textAlign: 'center',
						userSelect: 'none',
					}}
				/>
			</Tooltip>
			<InputBase fullWidth sx={{ fontSize: (t) => t.typography.caption.fontSize }} {...input} />
		</Stack>
	);
};
