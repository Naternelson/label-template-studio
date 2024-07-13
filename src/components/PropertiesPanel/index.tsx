import { Box, Collapse, useMediaQuery, useTheme } from '@mui/material';
import { BorderColor, PanelColor } from '../../constants';
import { GlobalSection } from './GlobalSection';
import { SheetSection } from './SheetSection';

export const PropertiesPanel = () => {
	const theme = useTheme();
	const isBig = useMediaQuery(theme.breakpoints.up('md'));

	return (
		<Box sx={{ height: '100%'}}>
			<Collapse in={isBig} orientation="horizontal" sx={{height: '100%'}}>
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
			</Collapse>
		</Box>
	);
};
