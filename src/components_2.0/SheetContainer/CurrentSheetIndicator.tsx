import { Box, IconButton, Stack, Typography, alpha, keyframes } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTemplateDispatch, useTemplateSelector } from '../../store';
import { updateCount, updateCurrentIndex } from '../../store/sheet';
import { Add, KeyboardArrowLeft, KeyboardArrowRight, Remove } from '@mui/icons-material';

export const CurrentSheetIndicator = () => {
	const mounted = useRef(false);
	const [left, setLeft] = useState(0);
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const el = document.getElementById('sheet-container');
		if (!el) return;
		const setDims = () => {
			mounted.current = true;
			const left = el.offsetLeft;
			const width = el.offsetWidth;
			setLeft(left);
			setWidth(width);
		};
		setDims();
		window.addEventListener('resize', setDims);
		return () => window.removeEventListener('resize', setDims);
		// Set the left Variable to half of the width of the sheet container plus its offset left
	}, []);

	return (
		<Stack
			direction={'row'}
			alignItems={'center'}
			justifyContent={'center'}
			sx={{
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
					animation: `${breatheAnimation} 10s infinite cubic-bezier(0.45, 0, 0.55, 1)`,
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundImage: (t) =>
						`radial-gradient(ellipse at center bottom, ${alpha(
							t.palette.primary.main,
							0.5,
						)}, transparent 30%)`,
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
	const dims = useTemplateSelector((s) => s.sheet.dimensions);
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
			<Stack
				gap={'8px'}
				id={'sheet-indicator'}
				direction={'row'}
				justifyContent={'flex-center'}
				alignItems={'center'}
				maxWidth="300px"
				overflow="auto"
				sx={{
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
			<Stack
				direction="row"
				justifyContent={'center'}
				alignItems="center"
				gap="8px"
                paddingBottom={"8px"}
				className="sheet-pagination-content">
				<IconButton disableRipple disabled={index === 0} onClick={moveBack}>
					<KeyboardArrowLeft fontSize={'small'} sx={{ fontSize: '.8rem' }} />
				</IconButton>
				<IconButton disableRipple disabled={count === 1} onClick={handleRemove}>
					<Remove fontSize={'small'} sx={{ fontSize: '.75rem' }} />
				</IconButton>
				<Typography variant="caption" sx={{ textTransform: 'uppercase' }} className={"indicator"}>
					Sheet {index + 1} of {count}
				</Typography>
				<IconButton disableRipple onClick={handleAdd}>
					<Add fontSize={'small'} sx={{ fontSize: '.75rem' }} />
				</IconButton>
				<IconButton disableRipple disabled={index === count - 1} onClick={moveForward}>
					<KeyboardArrowRight fontSize={'small'} sx={{ fontSize: '.8rem' }} />
				</IconButton>
			</Stack>
		</Stack>
	);
};

const breatheAnimation = keyframes`
  0%, 100% {
    background-size: 100% 100%;
    filter: hue-rotate(0deg);
  }
    
  50% {
    background-size: 200% 200%;
    filter: hue-rotate(10deg);
  }
`;

const ImitationSheet = (props: {
	dims: { width: number; height: number };
	index: number;
	currentIndex: number;
	count: number;
	hide?: boolean;
}) => {
	const dispatch = useTemplateDispatch();
	const ref = useRef<HTMLDivElement>(null);
	const count = props.count;
	const { width, height } = props.dims;
	const ratio = width / height;
	const maxWidth = 150;
	const maxHeight = 60;
	let imitationWidth = width;
	let imitationHeight = height;
	imitationWidth = maxWidth;
	imitationHeight = maxWidth / ratio;

	if (imitationHeight > maxHeight) {
		imitationHeight = maxHeight;
		imitationWidth = maxHeight * ratio;
	}
	const selected = props.currentIndex === props.index;
	const onClick = () => {
		if (selected) return;
		dispatch(updateCurrentIndex(props.index));
	};

	useEffect(() => {
		if (selected && ref.current) {
			ref.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
		}
	}, [selected, count]);

	return (
		<Box
			role="button"
			ref={ref}
			onClick={onClick}
			sx={{
				cursor: 'pointer',
				pointerEvents: props.hide ? 'none' : 'auto',
				opacity: props.hide ? 0 : 1,
				border: !selected ? '2px solid black' : (t) => '2px solid ' + t.palette.primary.main,
				marginX: 'auto',
				transition: 'all .1s ease',
				width: `${imitationWidth}px`, // ensure units are included
				height: `${imitationHeight}px`, // ensure units are included
				backgroundColor: selected ? 'white' : 'rgb(200,200,200)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				textTransform: 'uppercase',
				fontWeight: 'bold',
				color: `rgba(0, 0, 0, 0.5)`,
				'&:hover': {
					backgroundColor: 'white',
				},
			}}>
			{props.index + 1}
		</Box>
	);
};
