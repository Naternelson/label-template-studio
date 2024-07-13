import { Box, styled } from '@mui/material';

export type ViewportProps = {
	children: React.ReactNode;
    parentId?: string;
    contentId?: string;
};

export const Viewport = (props: ViewportProps) => {
    const { children, parentId, contentId:ci } = props;
    const containerId = `viewport-container${parentId ? `-${parentId}` : ''}`;
    const contentId = `viewport-content${ci ? `-${ci}` : ''}`;
	return (
		<Container id={containerId}>
			<Content id={contentId}>
                {children}
            </Content>
		</Container>
	);
};

const Container = styled(Box)(() => ({
    width: "100%",
    position: "relative",
}));

const Content = styled(Box)(() => ({
    position: "absolute",
}));