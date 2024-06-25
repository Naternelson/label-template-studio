import { Box } from '@mui/material';
import { SheetObject } from './SheetObject';
import { ScaleIndicator } from './ScaleIndicator';

export const Sheet = () => {
	return (
		<Box
			sx={{ overflow: 'auto', position: 'relative', flex: 1, height: '100%', maxHeight: '100%' }}
			aria-label="sheet_container">
			<SheetObject />
			<ScaleIndicator />
		</Box>
	);
};
