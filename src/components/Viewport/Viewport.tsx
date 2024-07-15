import { Box, BoxProps, styled } from '@mui/material';
import { gridDarkStyle } from '../../styles';
import { useDraggable } from './useDraggable';
import { useScaling } from './useScaling';

export type ViewportProps = {
	children: React.ReactNode;
	parentProps?: BoxProps;
	contentProps?: BoxProps;
};

export const Viewport = (props: ViewportProps) => {
	const { children, parentProps, contentProps } = props;
	const { id: parentId, ...p } = parentProps || {};
	const { id: ci, ...c } = contentProps || {};
	const containerId = `viewport-container${parentId ? `-${parentId}` : ''}`;
	const contentId = `viewport-content${ci ? `-${ci}` : ''}`;

	const { cursor, isPanning } = useDraggable({ containerId, contentId, boundary: 16, center:true });
	useScaling({
		containerId,
		contentId,
		boundary: 16,
	});

	return (
		<Container
			id={containerId}
			sx={{
				cursor: cursor,
			}}
			{...p}>
			<Content
				id={contentId}
				sx={{
					transition: isPanning ? 'none' : 'all .5s cubic-bezier(0.16, 1, 0.3, 1)',
				}}
				{...c}>
				{children}
			</Content>
			{/* <CenterButton /> */}
		</Container>
	);
};

// const CenterButton = () => {
// 	// const onClick = useCenterElement({ target: 'viewport-content' });
// 	return <Button onClick={onClick} sx={{position: "absolute", bottom: 0, right: "20px"}}>Center</Button>;
// }

const Container = styled(Box)(() => ({
	...gridDarkStyle,
	flex: 1,
	overflow: 'hidden',
}));

const Content = styled(Box)(() => ({
	position: 'absolute',
	height: 'fit-content',
}));
