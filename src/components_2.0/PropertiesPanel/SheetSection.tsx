import { Grid } from '@mui/material';
import { ControlSection } from './ControlSection';
import { useTemplateDispatch, useTemplateSelector } from '../../store';
import { VariableSliderProps } from '../VariableSlider/usehooks';
import { VariableSlider } from '../VariableSlider';
import { updateDimensions, updatePadding } from '../../store/sheet';
import { useClient, useClientSelector, useStorage } from '../../utility';

export const SheetSection = () => {
	return (
		<ControlSection label="sheet">
			<DimensionsControl />
			<MarginControls />
		</ControlSection>
	);
};

const DimensionsControl = () => {
	return (
		<Grid container>
			<Grid item xs={6}>
				<WidthControl />
			</Grid>
			<Grid item xs={6}>
				<HeightControl />
			</Grid>
		</Grid>
	);
};

const WidthControl = () => {
	const dispatch = useTemplateDispatch();
	const value = useClientSelector((state) => state.sheet.dimensions.width);
	const unit = useTemplateSelector((state) => state.global.unit);
	const toStorage = useStorage();
	const props: VariableSliderProps = {
		label: 'W',
		value: parseFloat(value),
		step: 0.1,
		min: 0.25,
		max: 20,
		tooltip: 'Width',
		commaSeparated: true,
		append: unit,
		onChange: (value: number) => {
			dispatch(
				updateDimensions({
					width: toStorage(value),
				}),
			);
		},
	};
	return <VariableSlider {...props} />;
};

const HeightControl = () => {
	const dispatch = useTemplateDispatch();
	const value = useClientSelector((state) => state.sheet.dimensions.height);
	const unit = useTemplateSelector((state) => state.global.unit);
	const toStorage = useStorage();
	const props: VariableSliderProps = {
		label: 'H',
		value: parseFloat(value),
		step: 0.1,
		min: 0.25,
		max: 20,
		tooltip: 'Height',
		commaSeparated: true,
		append: unit,
		onChange: (value: number) => {
			dispatch(
				updateDimensions({
					height: toStorage(value),
				}),
			);
		},
	};
	return <VariableSlider {...props} />;
};

const MarginControls = () => {
	return (
		<Grid container>
			<Grid item xs={6}>
				<MarginTopControl />
			</Grid>
			<Grid item xs={6}>
				<MarginLeftControl />
			</Grid>
			<Grid item xs={6}>
				<MarginBottomControl />
			</Grid>
			<Grid item xs={6}>
				<MarginRightControl />
			</Grid>
		</Grid>
	);
};

const MarginTopControl = () => {
	const dispatch = useTemplateDispatch();
	const { paddingTop, paddingBottom } = useTemplateSelector((state) => state.sheet.padding);
	const height = useTemplateSelector((state) => state.sheet.dimensions.height);
	const value = useClient(paddingTop);
	const max = height - paddingBottom;
	const unit = useTemplateSelector((state) => state.global.unit);
	const toStorage = useStorage();
	const props: VariableSliderProps = {
		label: 'T',
		value: parseFloat(value),
		step: 0.05,
		min: 0,
		max,
		toFixed: 2,
		tooltip: 'Margin Top',
		commaSeparated: true,
		append: unit,
		onChange: (value: number) => {
			dispatch(
				updatePadding({
					paddingTop: toStorage(value),
				}),
			);
		},
	};
	return <VariableSlider id='margin-top-control' {...props} />;
};

const MarginBottomControl = () => {
	const dispatch = useTemplateDispatch();
	const { paddingTop, paddingBottom } = useTemplateSelector((state) => state.sheet.padding);
	const height = useTemplateSelector((state) => state.sheet.dimensions.height);
	const value = useClient(paddingBottom);
	const max = height - paddingTop;
	const unit = useTemplateSelector((state) => state.global.unit);
	const toStorage = useStorage();
	const props: VariableSliderProps = {
		label: 'B',
		value: parseFloat(value),
		step: 0.1,
		min: 0,
		max,
		toFixed: 2,
		tooltip: 'Margin Bottom',
		commaSeparated: true,
		append: unit,
		onChange: (value: number) => {
			dispatch(
				updatePadding({
					paddingBottom: toStorage(value),
				}),
			);
		},
	};
	return <VariableSlider id="margin-bottom-control" {...props} />;
};

const MarginLeftControl = () => {
	const dispatch = useTemplateDispatch();
	const { paddingLeft, paddingRight } = useTemplateSelector((state) => state.sheet.padding);
	const width = useTemplateSelector((state) => state.sheet.dimensions.width);
	const value = useClient(paddingLeft);
	const max = width - paddingRight;
	const unit = useTemplateSelector((state) => state.global.unit);
	const toStorage = useStorage();
	const props: VariableSliderProps = {
		label: 'L',
		value: parseFloat(value),
		step: 0.1,
		min: 0,
		max,
		toFixed: 2,
		tooltip: 'Margin Left',
		commaSeparated: true,
		append: unit,
		onChange: (value: number) => {
			dispatch(
				updatePadding({
					paddingLeft: toStorage(value),
				}),
			);
		},
	};
	return <VariableSlider id="margin-left-control" {...props} />;
};

const MarginRightControl = () => {
	const dispatch = useTemplateDispatch();
	const { paddingLeft, paddingRight } = useTemplateSelector((state) => state.sheet.padding);
	const width = useTemplateSelector((state) => state.sheet.dimensions.width);
	const value = useClient(paddingRight);
	const max = width - paddingLeft;
	const unit = useTemplateSelector((state) => state.global.unit);
	const toStorage = useStorage();
	const props: VariableSliderProps = {
		label: 'R',
		value: parseFloat(value),
		step: 0.1,
		min: 0,
		max,
		toFixed: 2,
		tooltip: 'Margin Right',
		commaSeparated: true,
		append: unit,
		onChange: (value: number) => {
			dispatch(
				updatePadding({
					paddingRight: toStorage(value),
				}),
			);
		},
	};
	return <VariableSlider id="margin-right-control" {...props} />;
};
