import { useEffect, useRef } from "react";
import { useTemplateDispatch, useTemplateSelector } from "../store";
import { updateScale } from "../store/sheet";
import { useMediaQuery, useTheme } from "@mui/material";

export const useScaleToFitWidth = (width: number, params?: {
	elementId?: string;
	buffer?: string;
	block?: 'start' | 'center' | 'end' | 'nearest';
}) => {
	let {
		elementId = 'sheet-container',
		buffer = '10rem',
		block = 'start',
	} = params || { elementId: 'sheet-container', buffer: '10rem', block: 'start' };
	const dispatch = useTemplateDispatch();
	const theme = useTheme();
	const isBig = useMediaQuery(theme.breakpoints.up('md'))
	const unit = useTemplateSelector((s) => s.global.unit);
	const ref = useRef<HTMLElement>();
	if(!isBig) buffer = "1rem"; 
	useEffect(() => {
		if (!ref.current) {
			const el = document.getElementById(elementId);
			if (el !== null) ref.current = el;
		}
	}, [elementId]);

	const convertToUnit = (measurement: number) => {
		return unit === 'in' ? measurement : unit === 'cm' ? measurement * 2.54 : measurement * 25.4;
	};

	const getContainerWidth = () => {
		if (ref.current === null) {
			const el = document.getElementById(elementId)
			if (el !== null) ref.current = el;
		}
		return ref.current?.clientWidth;
	};
	const calculateScale = () => {
		const containerWidth = getContainerWidth();
		if (!containerWidth) return 1; // Default scale if container width is not available
		const dummyElement = document.createElement('div');
		const sheetWidth = `${convertToUnit(width)}${unit}`;

		dummyElement.style.width = sheetWidth;
		document.body.appendChild(dummyElement);
		const sheetWidthInPixels = dummyElement.clientWidth;
		dummyElement.style.width = buffer;
		const bufferWidth = dummyElement.clientWidth;

		document.body.removeChild(dummyElement);

		const scale = (containerWidth - bufferWidth) / sheetWidthInPixels;

		return scale;
	};

	const setScaleToFitWidth = () => {
		const scale = calculateScale();
		dispatch(updateScale(scale));
		// After the element finishes transitioning to the new scale, set the scale to 1
		ref.current?.addEventListener('transitionend', () => {
			ref.current?.scrollIntoView({ behavior: 'smooth', block });
		});
	};

	return setScaleToFitWidth;
};
