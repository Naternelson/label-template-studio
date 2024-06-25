import { Box } from '@mui/material';
import { BorderColor, PanelColor } from '../../constants';
import { GlobalSection } from './GlobalSection';
import { SheetSection } from './SheetSection';

export const PropertiesPanel = () => {
	return (
		<Box
			sx={{
				height: '100%',
				width: '240px',
				backgroundColor: PanelColor,
				borderLeft: `1px solid ${BorderColor}`,
			}}>
			<GlobalSection />
			<SheetSection />
		</Box>
	);
};
