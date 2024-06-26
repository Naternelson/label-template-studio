import { Paper, SxProps } from '@mui/material';
import { useTemplateDispatch, useTemplateSelector } from '../../store';
import { useClientSelector } from '../../utility';
import { useEffect, useRef, useState } from 'react';
import { updateCurrentLabelIndex } from '../../store/sheet';

export type LabelProps = {
	labelIndex: number;
};

export const Label = (props: LabelProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const currentLabelIndex = useTemplateSelector((s) => s.sheet.currentLabelIndex);
	const [hovering, setHovering] = useState(false);
	const backgroundColor = useTemplateSelector((s) => s.sheet.background.color);
	const paddingTop = useClientSelector((s) => s.sheet.labelSpecs.padding.paddingTop);
	const paddingRight = useClientSelector((s) => s.sheet.labelSpecs.padding.paddingRight);
	const paddingBottom = useClientSelector((s) => s.sheet.labelSpecs.padding.paddingBottom);
	const paddingLeft = useClientSelector((s) => s.sheet.labelSpecs.padding.paddingLeft);

	const scale = useTemplateSelector((s) => s.sheet.scale);

	const height = useClientSelector((s) => s.sheet.labelSpecs.labelHeight);
	const width = useClientSelector((s) => s.sheet.labelSpecs.labelWidth);
	const border = useTemplateSelector((s) => s.sheet.labelSpecs.border);
	const selected = currentLabelIndex === props.labelIndex;

	const sx: SxProps = {
		transition: 'all .1s ease',
		fontSize: calc('12px', scale),
		color: 'black',
		backgroundColor: backgroundColor,
		width: calc(width, scale),
		height: calc(height, scale),
		paddingTop: calc(paddingTop, scale),
		paddingRight: calc(paddingRight, scale),
		paddingBottom: calc(paddingBottom, scale),
		paddingLeft: calc(paddingLeft, scale),
		border: `${border.borderWidth}px ${border.borderStyle} ${border.borderColor}`,
		borderRadius: border.borderRadius,
		zIndex: selected ? 1000 : hovering ? 1000 : 0,
		flexShrink: 0,
		flexGrow: 0,
	};

	const onMouseOver = () => {
		setHovering(true);
	};
	const onMouseOut = () => {
		setHovering(false);
	};
	const elevation = selected ? 10 : hovering ? 5 : 1;
	const dispatch = useTemplateDispatch();
	const onDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (selected) return;
		dispatch(updateCurrentLabelIndex(props.labelIndex));
	};

	useEffect(() => {
		if (!selected) return;
		ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
	}, [selected]);
	return (
		<Paper
			ref={ref}
			onDoubleClick={onDoubleClick}
			aria-selected={selected}
			id={'label-' + props.labelIndex}
			elevation={elevation}
			sx={sx}
			onMouseEnter={onMouseOver}
			onMouseLeave={onMouseOut}>
			Hi there
		</Paper>
	);
};

const calc = (value: string, scale: number) => {
	return `calc(${value} * ${scale})`;
};

