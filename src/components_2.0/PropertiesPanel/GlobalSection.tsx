import { Divider, IconButton, Stack, Tooltip } from '@mui/material';
import { useTemplateDispatch, useTemplateSelector } from '../../store';
import { updateScale } from '../../store/sheet';
import { VariableSlider } from '../VariableSlider';
import { VariableSliderProps } from '../VariableSlider/usehooks';
import { ControlSection } from './ControlSection';
import { FullscreenExit, ZoomOutMap } from '@mui/icons-material';
import { BorderColor } from '../../constants';
import { setName } from '../../store/global';
import { PropertyInput } from '../PropertyInput';
import { useEffect, useRef } from 'react';

export const GlobalSection = () => {
	return (
		<ControlSection label="global">
			<Stack direction={'row'} spacing="8px">
				<ScaleSlider />
				<Stack
					direction={'row'}
					sx={{ alignItems: 'center', borderRadius: '5px', border: '1px solid ' + BorderColor }}
					divider={<Divider flexItem orientation="vertical" />}>
					<FitWidthBtn />
					<ResetSizeBtn />
				</Stack>
			</Stack>
			<Stack direction={'row'}>
				<TemplateNameControl />
			</Stack>
		</ControlSection>
	);
};

const TemplateNameControl = () => {
	const value = useTemplateSelector((s) => s.global.name);
	const dispatch = useTemplateDispatch();
	const onChange = (value: string) => {
		dispatch(setName(value));
	};
	return <PropertyInput label="Name" value={value} onChange={onChange} />;
};

const ScaleSlider = () => {
	const dispatch = useTemplateDispatch();
	const value = useTemplateSelector((state) => state.sheet.scale);
	const props: VariableSliderProps = {
		label: 'S',
		value: value,
		step: 0.01,
		min: 0.2,
		max: 3,
		tooltip: 'Scale',
		asPercentage: true,
		onChange: (value: number) => {
			dispatch(updateScale(value));
		},
	};
	return <VariableSlider {...props} />;
};

const ResetSizeBtn = () => {
	const dispatch = useTemplateDispatch();
	const onClick = () => {
		dispatch(updateScale(1));
	};
	return (
		<Tooltip arrow title="Reset Size">
			<IconButton disableRipple size={'small'} onClick={onClick} sx={{ width: '32px', height: '32px' }}>
				<FullscreenExit fontSize="small" />
			</IconButton>
		</Tooltip>
	);
};

const FitWidthBtn = () => {
	const setScaleToFitWidth = useScaleToFitWidth();

	return (
		<Tooltip arrow title="Fit Width">
			<IconButton
				disableRipple
				size={'small'}
				onClick={setScaleToFitWidth}
				sx={{ width: '32px', height: '32px' }}>
				<ZoomOutMap fontSize="small" />
			</IconButton>
		</Tooltip>
	);
};

const useScaleToFitWidth = () => {
	const dispatch = useTemplateDispatch();
	const width = useTemplateSelector((s) => s.sheet.dimensions.width);
	const unit = useTemplateSelector((s) => s.global.unit);
	const ref = useRef<HTMLDivElement>();

	useEffect(() => {
		if (!ref.current) {
			const el = document.getElementById('sheet-container') as HTMLDivElement | null;
			if (el !== null) ref.current = el;
		}
	}, []);

	const convertToUnit = (measurement: number) => {
		return unit === 'in' ? measurement : unit === 'cm' ? measurement * 2.54 : measurement * 25.4;
	};

	const getContainerWidth = () => {
		if (ref.current === null) {
			const el = document.getElementById('sheet-container') as HTMLDivElement | null;
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
		dummyElement.style.width = '10rem';
		const bufferWidth = dummyElement.clientWidth;

		document.body.removeChild(dummyElement);

		const scale = (containerWidth - bufferWidth) / sheetWidthInPixels;
		return scale;
	};

	const setScaleToFitWidth = () => {
		const scale = calculateScale();
		dispatch(updateScale(scale));
	};

	return setScaleToFitWidth;
};
