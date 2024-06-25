import { Box, IconButton, Menu, Toolbar, Tooltip, TooltipProps, styled } from '@mui/material';
import { GlobalState } from '../../store/global';
import { ReactNode, RefObject, useRef, useState } from 'react';
import { Instance } from '@popperjs/core';
import { BorderColor, PanelColor } from '../../constants';
import { ArrowDownward } from '@mui/icons-material';

export const TemplateToolbar = () => {
	return <StyledToolbar>Hello World</StyledToolbar>;
};

const StyledToolbar = styled(Toolbar)({
	zIndex: 2,
	height: '40px',
	backgroundColor: PanelColor,
	paddingX: '24px',
	position: 'relative',
	borderBottom: `1px solid ${BorderColor}`,
});

const FileManager = () => {};

type MainMenuButtonProps = {
	mode: GlobalState['mode'];
	onClick: () => void;
	icon: React.ReactNode;
	title: string;
	children?: React.ReactNode;
};
const MainMenuButton = (props: MainMenuButtonProps) => {
	const { children, title, onClick, icon } = props;

	const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const popperRef = useRef<Instance>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const onMouseMove = (e: React.MouseEvent) => {
		positionRef.current = { x: e.clientX, y: e.clientY };
		if (popperRef.current !== null) popperRef.current.update();
	};
	return (
		<>
			<MainMenuTooltip areaRef={buttonRef} positionRef={positionRef} popperRef={popperRef} title={title}>
				<StyledIconButton onClick={onClick} ref={buttonRef} onMouseMove={onMouseMove}>
					{icon}
					<MainMenuPopper anchorRef={buttonRef} menuOptions={children} />
				</StyledIconButton>
			</MainMenuTooltip>
		</>
	);
};

const MainMenuPopper = (props: { anchorRef: RefObject<HTMLButtonElement>; menuOptions?: ReactNode }) => {
	const { anchorRef, menuOptions } = props;
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	if (!menuOptions) return null;
	return (
		<Box onClick={handleOpen}>
			<ArrowDownward
				sx={{
					position: 'relative',
					top: 0,
					transition: 'top .2s ease',
					'&:hover': {
						top: '10px',
					},
				}}
			/>
			<Menu anchorEl={anchorRef.current} open={open} onClose={handleClose}>
				{menuOptions}
			</Menu>
		</Box>
	);
};

const StyledIconButton = styled(IconButton)({
	height: '100%',
	borderRadius: 0,
	padding: 0,
	width: '40px',
});

type MainMenuTooltipProps = {
	children: TooltipProps['children'];
	title: string;
	areaRef: RefObject<HTMLButtonElement>;
	positionRef: RefObject<{ x: number; y: number }>;
	popperRef: RefObject<Instance>;
};

const MainMenuTooltip = (props: MainMenuTooltipProps) => {
	const { children, title, areaRef, positionRef, popperRef } = props;
	const getBoundingClientRect = () => {
		const areaRect = areaRef.current!.getBoundingClientRect();
		const x = positionRef.current?.x ?? 0;
		return new DOMRect(x, areaRect.bottom, 0, 0);
	};
	return (
		<Tooltip
			title={title}
			placement="bottom"
			arrow
			PopperProps={{
				popperRef,
				anchorEl: { getBoundingClientRect },
			}}
			children={children}
		/>
	);
};
