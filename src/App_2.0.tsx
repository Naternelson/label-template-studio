import { Stack, Toolbar } from '@mui/material';
import { Background, SheetContainer } from './components_2.0';
import { PropertiesPanel } from './components_2.0/PropertiesPanel';

function App() {
	return (
		<Background>
            <Toolbar>
                Hi mom
            </Toolbar>
			<Stack direction={'row'} justifyContent={'space-around'} flex={1} sx={{ overflow: 'hidden' }}>
				<SheetContainer />
                <PropertiesPanel/>
			</Stack>

		</Background>
	);
}

export default App;
