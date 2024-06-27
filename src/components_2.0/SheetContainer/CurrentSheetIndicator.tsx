import { ButtonBase, Collapse, IconButton, Stack, Typography, alpha, keyframes, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTemplateDispatch, useTemplateSelector } from '../../store';
import { updateCount, updateCurrentIndex } from '../../store/sheet';
import { Add, KeyboardArrowLeft, KeyboardArrowRight, Remove } from '@mui/icons-material';
import { ImitationSheet } from './ImitationSheet';

export const CurrentSheetIndicator = () => {
	const mounted = useRef(false);
	const [left, setLeft] = useState(0);
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const el = document.getElementById('sheet-container');
		if (!el) return;

		const setDims = () => {
			if (!mounted.current) {
				mounted.current = true;
			}
			const left = el.offsetLeft;
			const width = el.offsetWidth;
			setLeft(left);
			setWidth(width);
		};

		setDims();

		const resizeObserver = new ResizeObserver(() => {
			setDims();
		});

		resizeObserver.observe(el);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<Stack
			direction={'row'}
			alignItems={'center'}
			justifyContent={'center'}
			sx={{
				display: { xs: 'none', md: 'flex' },
				opacity: mounted.current ? 1 : 0,
				textAlign: 'center',
				zIndex: 2000,
				position: 'fixed',
				left: left,
				bottom: 0,
				width: width,
				userSelect: 'none',
				overflow: 'visibile',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				'&::before': {
					transition: 'all 1s ease',
					opacity: 0,
					pointerEvents: 'none',
					zIndex: -1,
					content: '""',
					position: 'absolute',
					bottom: 0,
					minHeight: 'calc(100% + 10rem)',
					height: '50vh',
					left: 0,
					width: '100%',
					animation: `${breatheAnimation} 5s infinite ease-in-out`,
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundImage: (t) =>
						`radial-gradient(ellipse at center bottom, ${alpha(
							t.palette.primary.main,
							0.5,
						)}, transparent 30%),
                            radial-gradient(ellipse at center bottom, ${alpha(t.palette.secondary.main, 0.3)}, transparent 32%)`,
				},
				'&:has(.sheet-pagination-content:hover)::before': {
					opacity: 1,
				},
			}}>
			<Row />
		</Stack>
	);
};
const Row = () => {
	const mounted = useRef(false);
	const dims = useTemplateSelector((s) => s.sheet.dimensions);
	const index = useTemplateSelector((s) => s.sheet.currentIndex);
	const count = useTemplateSelector((s) => s.sheet.count);
	const [open, setOpen] = useState(true);

	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		// if (mounted.current) return;
		// mounted.current = true;
		let timeout: NodeJS.Timeout;
		const handleMouseEnter = () => {
			clearTimeout(timeout);
			setOpen(true);
		};
		const handleMouseLeave = () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				setOpen(false);
			}, 4000);
		};
		el.addEventListener('mouseenter', handleMouseEnter);
		el.addEventListener('mouseleave', handleMouseLeave);
		return () => {
			el.removeEventListener('mouseenter', handleMouseEnter);
			el.removeEventListener('mouseleave', handleMouseLeave);
			clearTimeout(timeout);
		};
	}, []);

	return (
		<Stack
			ref={ref}
			direction="column"
			flex={1}
			sx={{
				'&:hover button, &:hover .indicator': {
					opacity: 1,
				},
				'& button, .indicator': {
					opacity: 0,
					transition: 'all 1s ease',
				},
			}}
			className="sheet-pagination-content"
			justifyContent={'center'}
			alignItems={'center'}>
			<Collapse
				in={open}
				timeout={{
					appear: 1000,
					enter: 1000,
					exit: 2000,
				}}>
				<ButtonBase
					sx={{ textTransform: 'uppercase', fontSize: '12px', textShadow: '0px 0px 4px rgba(0,0,0,1)' }}
					onClick={() => setOpen(false)}>
					Hide
				</ButtonBase>
				<Stack
					gap={'8px'}
					id={'sheet-indicator'}
					direction={'row'}
					justifyContent={'flex-center'}
					alignItems={'center'}
					maxWidth="300px"
					sx={{
						overflowX: 'auto',
						overflowY: 'hidden',
						textWrap: 'nowrap',
						maskImage: 'linear-gradient(to right, transparent, black 30%, black 70%, transparent)',
						'& > *': {
							flexShrink: 0,
						},
						'&::-webkit-scrollbar': {
							display: 'none',
						},
						scrollbarWidth: 'none',
						msOverflowStyle: 'none',
					}}>
					<ImitationSheet key={-1} dims={dims} index={-1} currentIndex={index} count={count} hide />
					{Array.from({ length: count }).map((_, i) => (
						<ImitationSheet key={i} dims={dims} index={i} currentIndex={index} count={count} />
					))}
					<ImitationSheet key={count} dims={dims} index={count} currentIndex={index} count={count} hide />
				</Stack>
			</Collapse>
			<SheetPaginationContent />
		</Stack>
	);
};

const SheetPaginationContent = () => {
	const index = useTemplateSelector((s) => s.sheet.currentIndex);
	const count = useTemplateSelector((s) => s.sheet.count);
	const dispatch = useTemplateDispatch();
	const handleRemove = () => {
		if (count === 1) return;
		const numValue = count - 1;
		dispatch(updateCount(numValue));
		if (index === count - 1) dispatch(updateCurrentIndex(count - 2));
	};

	const handleAdd = () => {
		const numValue = count + 1;
		dispatch(updateCount(numValue));
	};

	const moveBack = () => {
		if (index === 0) return;
		dispatch(updateCurrentIndex(index - 1));
	};
	const moveForward = () => {
		if (index === count - 1) return;
		dispatch(updateCurrentIndex(index + 1));
	};
	return (
		<Stack
			direction="row"
			justifyContent={'center'}
			alignItems="center"
			gap="8px"
			paddingBottom={'8px'}
			className="sheet-pagination-content">
			<StyledIconButton disableRipple disabled={index === 0} onClick={moveBack}>
				<KeyboardArrowLeft />
			</StyledIconButton>
			<StyledIconButton disableRipple disabled={count === 1} onClick={handleRemove}>
				<Remove />
			</StyledIconButton>
			<Typography
				variant="caption"
				sx={{
					textShadow: '0px 0px 2px rgba(0,0,0,.7), 0px 0px 4px rgba(0,0,0,.4), 0px 0px 10px rgba(0,0,0,.2)',
					textTransform: 'uppercase',
				}}
				className={'indicator'}>
				Sheet {index + 1} of {count}
			</Typography>
			<StyledIconButton disableRipple onClick={handleAdd}>
				<Add />
			</StyledIconButton>
			<StyledIconButton disableRipple disabled={index === count - 1} onClick={moveForward}>
				<KeyboardArrowRight />
			</StyledIconButton>
		</Stack>
	);
};

const StyledIconButton = styled(IconButton)(() => ({
	'& > .MuiSvgIcon-root': {
		fontSize: '1rem',
		filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,.7))',
	},
}));
const breatheAnimation = keyframes`
  0%, 100% {
    background-size: 100% 100%;
    filter: hue-rotate(0deg);
  }
    
  50% {
    background-size: 200% 200%;
    filter: hue-rotate(-15deg);
  }
`;
