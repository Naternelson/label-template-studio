import { Stack } from '@mui/material';
import { BorderColor } from '../../constants';
export type ControlSectionProps = {
	label: string;
	buttons?: React.ReactNode;
	children?: React.ReactNode;
};

export const ControlSection = (props: ControlSectionProps) => {
	const { label, buttons } = props;
	return (
		<Stack
			aria-label={'control-' + props.label}
			sx={{
				padding: '.75rem',
				borderBottom: '1px solid ' + BorderColor,
				fontSize: (t) => t.typography.caption.fontSize,
			}}>
			<Stack
				minHeight={'1.5rem'}
				alignItems={'center'}
				direction={'row'}
				justifyContent="space-between"
				sx={{ textTransform: 'capitalize', fontWeight: 'bold', cursor: 'default' }}>
				<span>{label}</span>
				{buttons}
			</Stack>
			{props.children}
		</Stack>
	);
};
