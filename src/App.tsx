import { Stack } from '@mui/material';
import { Background } from './components';
import { TemplateToolbar } from './components/Toolbar';
import { Sheet } from './components/Sheet';
import { ControlPanel } from './components/ControlPanel';
import "./index.css"

function App() {
	return (
		<Background>
			<TemplateToolbar />
			<Stack direction={'row'} justifyContent={'space-around'} flex={1} sx={{"overflow": "hidden"}}>

				<Sheet />
				<ControlPanel />
			</Stack>
		</Background>
	);
}

export default App;
