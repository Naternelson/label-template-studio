import { Box, Stack, Toolbar, Typography } from '@mui/material';
import { Background, SheetContainer, PropertiesPanel } from './components';
import {  } from './components/PropertiesPanel';
import { BorderColor, PanelColor } from './constants';
import { useTemplateSelector } from './store';

function App() {
	const name = useTemplateSelector((s) => s.global.name);
	return (
		<Background>
			<Toolbar sx={{ backgroundColor: PanelColor, borderBottom: `1px solid ${BorderColor}` }}>
				<Box></Box>
				<Stack direction="row" alignItems={'center'} flex={1} justifyContent={'center'}>
					<Typography variant="subtitle1" textAlign={'center'} sx={{"& > span": {
						color: 'rgba(255,255,255,.5)',
						userSelect: 'none',
					
					}}}>
						<span>Template / </span> {name}
					</Typography>
				</Stack>
				<Box></Box>
			</Toolbar>
			<Stack direction={'row'} justifyContent={'space-around'} flex={1} sx={{ overflow: 'hidden' }}>
				<SheetContainer />
				<PropertiesPanel />
			</Stack>
		</Background>
	);
}

export default App;
