import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Border, Padding } from '../../types';

export type Dimensions = {
	width: number;
	height: number;
};

export type Grid = {
	show: boolean;
	spacing: number;
};

export type Background = {
	print: boolean;
	color: string;
};

export type LabelSpecs = {
	rows: number;
	columns: number;
	labelWidth: number;
	labelHeight: number;
	padding: Padding;
	border: Border;
};

export type Sheet = {
	padding: Padding;
	scale: number;
	count: number;
	background: Background;
	grid: Grid;
	labelSpecs: LabelSpecs;
	dimensions: Dimensions;
	currentIndex: number;
	currentLabelIndex?: number;
};

const initialState: Sheet = {
	padding: {
		paddingTop: 0.25,
		paddingRight: 0.25,
		paddingBottom: 0.25,
		paddingLeft: 0.25,
	},
	scale: 1,
	count: 1,
	background: {
		print: false,
		color: 'white',
	},
	grid: {
		show: true,
		spacing: 0.25,
	},
	labelSpecs: {
		rows: 2,
		columns: 2,
		labelWidth: 2.7,
		labelHeight: 1.7,
		padding: {
			paddingTop: 0.1,
			paddingRight: 0.1,
			paddingBottom: 0.1,
			paddingLeft: 0.1,
		},
		border: {
			borderWidth: 0,
			borderColor: '',
			borderStyle: '',
			borderRadius: 0,
		},
	},
	dimensions: {
		width: 6,
		height: 4,
	},
	currentIndex: 0,
};

export const SheetSlice = createSlice({
	name: 'sheet',
	initialState,
	reducers: {
		resetSheet: (state) => {
			state = initialState;
		},
		updatePadding: (state, action: PayloadAction<Partial<Padding>>) => {
			state.padding = { ...state.padding, ...action.payload };
		},
		updateScale: (state, action: PayloadAction<number>) => {
			state.scale = action.payload;
		},
		updateCount: (state, action: PayloadAction<number>) => {
			state.count = action.payload;
		},
		updateBackground: (state, action: PayloadAction<Partial<Background>>) => {
			state.background = { ...state.background, ...action.payload };
		},
		updateGrid: (state, action: PayloadAction<Partial<Grid>>) => {
			state.grid = { ...state.grid, ...action.payload };
		},
		updateLabelPadding: (state, action: PayloadAction<Partial<Padding>>) => {
			state.labelSpecs.padding = { ...state.labelSpecs.padding, ...action.payload };
		},
		updateLabelBorder: (state, action: PayloadAction<Partial<Border>>) => {
			state.labelSpecs.border = { ...state.labelSpecs.border, ...action.payload };
		},
		updateLabelSpecs: (state, action: PayloadAction<Partial<LabelSpecs>>) => {
			state.labelSpecs = { ...state.labelSpecs, ...action.payload };
		},
		updateDimensions: (state, action: PayloadAction<Partial<Dimensions>>) => {
			state.dimensions = { ...state.dimensions, ...action.payload };
		},
		updateCurrentIndex: (state, action: PayloadAction<number>) => {
			state.currentIndex = action.payload;
			delete state.currentLabelIndex;
		},
		resetCurrentLabelIndex: (state) => {
			delete state.currentLabelIndex;
		},
		updateCurrentLabelIndex: (state, action: PayloadAction<number>) => {
			console.log({ action });
			// Calculate the sheet index based on the current label index and the number of labels per sheet
			state.currentLabelIndex = action.payload;
			state.currentIndex = Math.floor(action.payload / (state.labelSpecs.rows * state.labelSpecs.columns));
		},
		setState: (state, action: PayloadAction<Sheet>) => {
			state = action.payload;
		},
		incrementScale: (state, action: PayloadAction<{ increment: number; min: number; max: number }>) => {
			state.scale = Math.max(
				action.payload.min,
				Math.min(action.payload.max, state.scale + action.payload.increment),
			);
		},
	},
});

export const {
	resetSheet,
	updatePadding,
	updateScale,
	updateCount,
	updateBackground,
	updateGrid,
	updateLabelPadding,
	updateLabelBorder,
	updateLabelSpecs,
	updateDimensions,
	updateCurrentIndex,
	updateCurrentLabelIndex,
	resetCurrentLabelIndex,
	setState,
	incrementScale
} = SheetSlice.actions;

export default SheetSlice.reducer;
