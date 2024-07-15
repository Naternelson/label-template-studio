import { Box, BoxProps, Button, FormControlLabel, Stack, styled, Switch, TextField, Typography } from '@mui/material';
import { gridDarkStyle } from '../../styles';
import { useCenterContent, useDraggable } from './useDraggable';
import { useScaling } from './useScaling';
import { Boundary, Center } from './util';
import { useState } from 'react';

export type ViewportProps = {
	children: React.ReactNode;
	parentProps?: BoxProps;
	contentProps?: BoxProps;
	boundary?: Boundary;
	center?: Center;
	disabled?: boolean;
};

export const Viewport = (props: ViewportProps) => {
	const { children, parentProps, contentProps, boundary, center, disabled } = props;
	const { id: parentId, ...p } = parentProps || {};
	const { id: ci, ...c } = contentProps || {};
	const containerId = `viewport-container${parentId ? `-${parentId}` : ''}`;
	const contentId = `viewport-content${ci ? `-${ci}` : ''}`;
	const boundaryControls = BoundaryControls(boundary);
	const disableControls = DisableControls();

	const { cursor, isPanning } = useDraggable({
		containerId,
		contentId,
		boundary: {
			top: boundaryControls.top,
			left: boundaryControls.left,
			right: boundaryControls.right,
			bottom: boundaryControls.bottom,
		},
		center,
		disabled: disableControls.disabled,
	});
	// useScaling({
	// 	containerId,
	// 	contentId,
	// 	boundary: boundary,
	// });

	return (
		<Container
			role="container"
			aria-label={containerId}
			id={containerId}
			sx={{
				cursor: cursor,
			}}
			{...p}>
			<Content
				role="content"
				id={contentId}
				sx={{
					transition: isPanning ? 'none' : 'all .5s cubic-bezier(0.16, 1, 0.3, 1)',
				}}
				{...c}>
				{children}
			</Content>
			<Stack
				gap={1}
				justifyContent={'center'}
				alignItems={'center'}
				direction="column"
				sx={{ position: 'absolute', bottom: 10, right: '50%', transform: 'translateX(50%)' }}>
				<CenterButton />
				{boundaryControls.render()}
				{disableControls.render()}
			</Stack>
		</Container>
	);
};

const CenterButton = () => {
	const onClickCenter = useCenterContent({
		containerId: 'viewport-container',
		contentId: 'viewport-content',
	});
	const onClickX = useCenterContent({
		containerId: 'viewport-container',
		contentId: 'viewport-content',
		center: {
			x: true,
		},
	});
	const onClickY = useCenterContent({
		containerId: 'viewport-container',
		contentId: 'viewport-content',
		center: {
			y: true,
		},
	});
	// const onClick = useCenterElement({ target: 'viewport-content' });
	return (
		<Stack gap={1} direction="row">
			<Button variant={'contained'} onClick={onClickCenter}>
				Center
			</Button>
			<Button variant={'contained'} onClick={onClickX}>
				Center X
			</Button>
			<Button variant={'contained'} onClick={onClickY}>
				Center Y
			</Button>
		</Stack>
	);
};

const BoundaryControls = (boundary?: Boundary) => {
	const boundaryType = typeof boundary;
	const defaultTop = typeof boundary === 'object' ? boundary?.top || boundary?.y : boundary;
	const defaultLeft = typeof boundary === 'object' ? boundary?.left || boundary?.x : boundary;
	const defaultRight = typeof boundary === 'object' ? boundary?.right || boundary?.x : boundary;
	const defaultBottom = typeof boundary === 'object' ? boundary?.bottom || boundary?.y : boundary;
	const [top, setTop] = useState<undefined | number>(defaultTop);
	const [left, setLeft] = useState<undefined | number>(defaultLeft);
	const [right, setRight] = useState<undefined | number>(defaultRight);
	const [bottom, setBottom] = useState<undefined | number>(defaultBottom);

	const onChange = (key: 'top' | 'left' | 'right' | 'bottom') => (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		switch (key) {
			case 'top':
				setTop(value ? parseFloat(value) : undefined);
				break;
			case 'left':
				setLeft(value ? parseFloat(value) : undefined);
				break;
			case 'right':
				setRight(value ? parseFloat(value) : undefined);
				break;
			case 'bottom':
				setBottom(value ? parseFloat(value) : undefined);
				break;
		}
	};
	const render = () => {
		return (
			<Stack gap={1} direction="row" alignItems={'center'}>
				<Typography variant="h6">Boundary</Typography>
				<TextField
					variant="filled"
					size="small"
					label={'Top'}
					value={top}
					type="number"
					placeholder="top"
					onChange={onChange('top')}
				/>
				<TextField
					variant="filled"
					size="small"
					label={'Left'}
					value={left}
					type="number"
					placeholder="left"
					onChange={onChange('left')}
				/>
				<TextField
					variant="filled"
					size="small"
					label={'Right'}
					value={right}
					type="number"
					placeholder="right"
					onChange={onChange('right')}
				/>
				<TextField
					variant="filled"
					size="small"
					label={'Bottom'}
					value={bottom}
					type="number"
					placeholder="bottom"
					onChange={onChange('bottom')}
				/>
			</Stack>
		);
	};
	return {
		render,
		top,
		left,
		right,
		bottom,
	};
};

const DisableControls = () => {
	const [disabled, setDisabled] = useState(false);
	const render = () => {
		return (
			<FormControlLabel
				label={'Disable'}
				control={
					<Switch checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
				}></FormControlLabel>
		);
	};
	return {
		render,
		disabled,
	};
};

const Container = styled(Box)(() => ({
	...gridDarkStyle,
	flex: 1,
	overflow: 'hidden',
}));

const Content = styled(Box)(() => ({
	position: 'absolute',
	height: 'fit-content',
}));
