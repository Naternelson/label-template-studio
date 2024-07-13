import { Grid, IconButton, InputAdornment, InputBase, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { ControlSection } from './ControlSection';
import { useTemplateDispatch, useTemplateSelector } from '../../store';
import { VariableSliderProps } from '../VariableSlider/usehooks';
import { VariableSlider } from '../VariableSlider';
import { updateCount, updateCurrentIndex, updateDimensions, updatePadding } from '../../store/sheet';
import { useClient, useClientSelector, useStorage } from '../../utility';
import { ComboBox } from '../ComboBox';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { Add, ArrowDropDown, ArrowDropUp, Remove } from '@mui/icons-material';

export const SheetSection = () => {
	return (
		<ControlSection label="sheet">
			<DimensionsControl />
			<MarginControls />
			<CurrentSheetControl />
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
	return <VariableSlider id="margin-top-control" {...props} />;
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

const CurrentSheetControl = () => {
	const dispatch = useTemplateDispatch();
	const count = useTemplateSelector((s) => s.sheet.count);
	const [renderValue, setRenderValue] = useState(count.toString());

	const currentIndex = useTemplateSelector((s) => s.sheet.currentIndex);
	const options = Array.from({ length: count }, (_, i) => ({ label: (i + 1).toString(), value: i.toString() }));

	const onChange = (event: SelectChangeEvent) => {
		const value = event.target.value;
		const numValue = parseInt(value);
		dispatch(updateCurrentIndex(numValue));
	};

	const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRenderValue(event.target.value);
	};
	const onInputBlur = () => {
		const min = 1;
		const max = 100;
		let numValue = parseInt(renderValue);
		if (isNaN(numValue)) {
			setRenderValue(count.toString());
			numValue = count;
		}
		if (numValue < min) {
			setRenderValue(min.toString());
			numValue = min;
		} else if (numValue > max) {
			setRenderValue(max.toString());
			numValue = max;
		}
		dispatch(updateCount(numValue));
		if (currentIndex >= numValue) {
			dispatch(updateCurrentIndex(numValue - 1));
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onInputBlur();
			inputRef.current?.blur();
		}
	};
	const inputRef = useRef<HTMLInputElement>(null);

	const handleAdd = () => {
		const numValue = count + 1;
		dispatch(updateCount(numValue));
		setRenderValue(numValue.toString());
	};
	const handleRemove = () => {
		if (count === 1) return;
		const numValue = count - 1;
		dispatch(updateCount(numValue));
		setRenderValue(numValue.toString());
	};

	useEffect(() => {
		// When the count changes externally, update the input value
		setRenderValue(count.toString());
	}, [count]);

	return (
		<Stack
			marginTop={'8px'}
			sx={{ color: 'rgba(255,255,255,.75)' }}
			direction={'row'}
			height="32px"
			alignItems={'center'}
			gap={'8px'}
			justifyContent={'flex-end'}
			paddingLeft={'8px'}>
			<Typography variant="caption">Sheet</Typography>
			<ComboBox value={`${currentIndex}`} options={options} onChange={onChange} />
			<Typography variant="caption">of</Typography>
			<InputBase
				inputRef={inputRef}
				onClick={() => {
					if (inputRef.current) {
						inputRef.current.focus();
						inputRef.current.select();
					}
				}}
				endAdornment={
					<InputAdornment position="end" sx={{ position: 'relative' }}>
						<Stack direction="column">
							<IconButton
								onClick={handleAdd}
								disableRipple
								size="small"
								sx={{
									overflow: 'hidden',
									lineSpacing: '0',
									padding: 0,
									opacity: '.5',
									'&:hover': {
										opacity: '1',
									},
									'& svg': {
										margin: '-4px',
									},
								}}>
								<ArrowDropUp fontSize="small" />
							</IconButton>
							<IconButton
								disableRipple
								size="small"
								sx={{
									overflow: 'hidden',
									fontSize: '.5rem',
									padding: 0,
									opacity: '.5',
									'&:hover': {
										opacity: '1',
									},
									'& svg': {
										margin: '-4px',
									},
								}}
								disabled={count <= 1}
								onClick={handleRemove}>
								<ArrowDropDown fontSize="small" />
							</IconButton>
						</Stack>
					</InputAdornment>
				}
				inputProps={{ sx: { padding: '.25rem' } }}
				onKeyDown={handleKeyPress}
				onChange={onInputChange}
				onBlur={onInputBlur}
				value={renderValue}
				sx={{
					border: '1px solid transparent',
					':hover': {
						border: (t) => '1px solid ' + 'rgba(255,255,255,.5)',
					},
					fontSize: (t) => t.typography.caption.fontSize,
					':focus-within': {
						border: (t) => '1px solid ' + t.palette.primary.main,
					},
				}}
			/>
		</Stack>
	);
};
