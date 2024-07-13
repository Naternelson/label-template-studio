import { MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material';

export type ComboBoxProps = {
	onChange?: (event: SelectChangeEvent) => void;
	value: string;
	options: string[] | { label: string; value: string }[];
};

export const ComboBox = (props: ComboBoxProps) => {
	const { onChange, value, options } = props;
    const fontSize = useTheme().typography.caption.fontSize;
	return (
		<Select
			fullWidth
			value={value}
			onChange={onChange}
			sx={{ height: '32px' }}
            MenuProps={{ sx: {fontSize}, }}
			inputProps={{ sx: { fontSize} }}>
			{options.map((option) => {
				if (typeof option === 'string') {
					return (
						<MenuItem key={option} value={option} sx={{fontSize}}>
							{option}
						</MenuItem>
					);
				}
				return (
					<MenuItem key={option.value} value={option.value} sx={{fontSize}}>
						{option.label}
					</MenuItem>
				);
			})}
		</Select>
	);
};
