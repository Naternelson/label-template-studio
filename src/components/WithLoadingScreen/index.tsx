import { Box, styled, Typography } from "@mui/material";
import { PropsWithChildren, Suspense } from "react";

export const WithLoadingScreen = (props: PropsWithChildren) => {
    return <Suspense fallback={<LoadingContent/>}>
        {props.children}
    </Suspense>
}

const LoadingContent = () => {
    return <StyledLoading>
        <Typography variant="h5">Loading...</Typography>
    </StyledLoading>
}

const StyledLoading = styled(Box)(() => ({  
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}));