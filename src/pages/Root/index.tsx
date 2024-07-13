import { Box, Stack, Toolbar, Typography } from "@mui/material";
import { Background, PropertiesPanel, SheetContainer } from "../../components";
import { useTemplateSelector } from "../../store";
import { PanelColor } from "../../constants";
import { BorderColor } from "@mui/icons-material";

export const RootPage = () => {
	const name = useTemplateSelector((s) => s.global.name);
	return (
		<Background>
			<Toolbar sx={{ backgroundColor: PanelColor, borderBottom: `1px solid ${BorderColor}` }}>
				<Box></Box>
				<Stack direction="row" alignItems={'center'} flex={1} justifyContent={'center'}>
					<Typography
						variant="subtitle1"
						textAlign={'center'}
						sx={{
							'& > span': {
								color: 'rgba(255,255,255,.5)',
								userSelect: 'none',
							},
						}}>
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
};
