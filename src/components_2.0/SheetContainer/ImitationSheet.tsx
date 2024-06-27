import { useEffect, useRef } from "react";
import { useTemplateDispatch } from "../../store";
import { Box } from "@mui/material";
import { updateCurrentIndex } from "../../store/sheet";

export const ImitationSheet = (props: {
	dims: { width: number; height: number };
	index: number;
	currentIndex: number;
	count: number;
	hide?: boolean;
}) => {
	const dispatch = useTemplateDispatch();
	const ref = useRef<HTMLDivElement>(null);
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
		if (!selected || !ref.current) return;
		const el = ref.current;
		const scrollIntoView = () => {
			el.scrollIntoView({ behavior: 'smooth', inline: 'center' });
		};
		el.addEventListener('transitionend', scrollIntoView);
		return () => el.removeEventListener('transitionend', scrollIntoView);
	}, [imitationHeight, imitationWidth, selected]);

	return (
		<Box
			className="sheet-imitation"
			role="button"
			ref={ref}
			onClick={onClick}
			sx={{
				position: 'relative',
				display: 'flex',
				cursor: 'pointer',
				pointerEvents: props.hide ? 'none' : 'auto',
				opacity: props.hide ? 0 : 1,
				border: !selected ? '2px solid black' : (t) => '2px solid ' + t.palette.primary.main,
				marginX: 'auto',
				transition: 'all .1s ease',
				width: `${imitationWidth}px`, // ensure units are included
				height: `${imitationHeight}px`, // ensure units are included
				backgroundColor: selected ? 'white' : 'rgb(200,200,200)',
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
