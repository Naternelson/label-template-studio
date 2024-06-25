import { Box, Collapse, styled, useMediaQuery, useTheme } from "@mui/material"
import { BorderColor, PanelColor } from "../../constants"
import { useState } from "react";

export const ControlPanel = () => {
    const theme = useTheme()
    const isSm = useMediaQuery(theme.breakpoints.down("md"))
    const [open, setOpen] = useState(false);
    return (
		<Collapse orientation="horizontal" in={isSm ? open : true}>
			<StyledControlPanel />
		</Collapse>
	);
}

const StyledControlPanel = styled(Box)({
    backgroundColor: PanelColor,
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "240px",
    borderLeft:`1px solid ${BorderColor}`
})