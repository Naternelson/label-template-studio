import { useCallback, useMemo } from 'react';
import { useTemplateDispatch, useTemplateSelector } from '..';
import { Border, Padding } from '../../types';
import { useUnit } from '../global/hooks';
import {
	Dimensions,
	updateBackground,
	updateCount,
	updateCurrentIndex,
	updateDimensions,
	updateGrid,
	updateLabelBorder,
	updateLabelPadding,
	updateLabelSpecs,
	updatePadding,
	updateScale,
	updateCurrentLabelIndex,
	resetCurrentLabelIndex,
} from '.';

export const useScale = () => {
	const scale = useTemplateSelector((state) => state.sheet.scale);
	const dispatch = useTemplateDispatch();
	const increment = useCallback(
		(delta: number) => {
			const max = 4;
			const min = 0.1;
			const newScale = Math.min(max, Math.max(min, scale + delta));
			dispatch(updateScale(newScale));
		},
		[dispatch, scale],
	);
	const reset = useCallback(() => {
		dispatch(updateScale(1));
	}, [dispatch]);
	return { scale, increment, reset };
};

export const useSheetPadding = () => {
	const { scale } = useScale();
	const { paddingBottom, paddingTop, paddingLeft, paddingRight } = useTemplateSelector(
		(state) => state.sheet.padding,
	);
	const { unit, convertForClient, convertForStorage } = useUnit();
	const dispatch = useTemplateDispatch();
	return {
		update: useCallback(
			(padding: Partial<Padding>) => {
				const convertedPadding: Partial<Padding> = {};
				if (padding.paddingTop) {
					convertedPadding.paddingTop = convertForStorage(padding.paddingTop);
				}
				if (padding.paddingRight) {
					convertedPadding.paddingRight = convertForStorage(padding.paddingRight);
				}
				if (padding.paddingBottom) {
					convertedPadding.paddingBottom = convertForStorage(padding.paddingBottom);
				}
				if (padding.paddingLeft) {
					convertedPadding.paddingLeft = convertForStorage(padding.paddingLeft);
				}

				dispatch(updatePadding(convertedPadding));
			},
			[convertForStorage, dispatch],
		),
		padding: {
			top: convertForClient(paddingTop),
			right: convertForClient(paddingRight),
			bottom: convertForClient(paddingBottom),
			left: convertForClient(paddingLeft),
		},
		unit,
		scaled: {
			top: convertForClient(paddingTop * scale),
			right: convertForClient(paddingRight * scale),
			bottom: convertForClient(paddingBottom * scale),
			left: convertForClient(paddingLeft * scale),
		},
	};
};

export const useSheetCount = () => {
	const count = useTemplateSelector((state) => state.sheet.count);
	const dispatch = useTemplateDispatch();
	const update = useCallback(
		(value: number) => {
			const min = 1;
			const max = 100;
			const newCount = Math.min(max, Math.max(min, value));
			dispatch(updateCount(newCount));
		},
		[dispatch],
	);
	return { count, update };
};

export const useSheetBackground = () => {
	const { print, color } = useTemplateSelector((state) => state.sheet.background);
	const dispatch = useTemplateDispatch();
	const togglePrint = useCallback(() => {
		dispatch(updateBackground({ print: !print }));
	}, [dispatch, print]);
	const updateColor = useCallback(
		(color: string) => {
			dispatch(updateBackground({ color }));
		},
		[dispatch],
	);
	return { print, color, togglePrint, updateColor };
};

export const useSheetGrid = () => {
	const { show, spacing } = useTemplateSelector((state) => state.sheet.grid);
	const { unit, convertForClient, convertForStorage } = useUnit();
	const dispatch = useTemplateDispatch();
	const toggleShow = useCallback(() => {
		dispatch(updateGrid({ show: !show }));
	}, [dispatch, show]);

	const updateSpacing = useCallback(
		(spacing: number) => {
			spacing = convertForStorage(spacing);
			const min = 0;
			const max = 1000;
			const newSpacing = Math.min(max, Math.max(min, spacing));

			dispatch(updateGrid({ spacing: newSpacing }));
		},
		[dispatch, convertForStorage],
	);
	return { show, spacing: convertForClient(spacing), toggleShow, updateSpacing, unit };
};

export const useSheetIndex = () => {
	const count = useTemplateSelector((state) => state.sheet.count);
	const spacing = useLabelSpecSpacing();
	const maxLabels = spacing.rows * spacing.columns * count;
	const currentIndex = useTemplateSelector((state) => state.sheet.currentIndex);
	const currentLabelIndex = useTemplateSelector((state) => state.sheet.currentLabelIndex);
	const dispatch = useTemplateDispatch();
	const updateIndex = useCallback(
		(index: number) => {
			const min = 0;
			const max = count - 1;
			index = Math.min(max, Math.max(min, index));
			dispatch(updateCurrentIndex(index));
		},
		[dispatch, count],
	);
	const updateLabelIndex = useCallback(
		(index?: number) => {
			if (index === undefined) {
				dispatch(resetCurrentLabelIndex());
				return;
			}
			const min = 0;
			const max = maxLabels - 1;
			index = Math.min(max, Math.max(min, index));
			dispatch(updateCurrentLabelIndex(index));
		},
		[maxLabels, dispatch],
	);
	return { currentIndex, updateIndex, count, currentLabelIndex, updateLabelIndex };
};

export const useSheetDims = () => {
	const scale = useScale();
	const { width, height } = useTemplateSelector((state) => state.sheet.dimensions);
	const dispatch = useTemplateDispatch();
	const { unit, convertForClient, convertForStorage } = useUnit();
	const update = useCallback(
		(dims: Partial<Dimensions>) => {
			const convertedDims: Partial<Dimensions> = {};
			if (dims.width) {
				convertedDims.width = convertForStorage(dims.width);
			}
			if (dims.height) {
				convertedDims.height = convertForStorage(dims.height);
			}
			dispatch(updateDimensions(convertedDims));
		},
		[dispatch, convertForStorage],
	);
	return {
		width: convertForClient(width),
		height: convertForClient(height),
		update,
		unit,
		scaled: {
			width: convertForClient(width * scale.scale),
			height: convertForClient(height * scale.scale),
		},
	};
};

const exceedsSheet = (params: {
	sheetPadding: Padding;	
	rows: number;
	columns: number;
	sheetDim: { width: number; height: number };
	labelDims: { width: number; height: number };
}) => {
	const { sheetPadding, rows, columns, sheetDim, labelDims } = params;
	const { width, height } = sheetDim;
	const { width: labelWidth, height: labelHeight } = labelDims;
	const { paddingTop, paddingRight, paddingBottom, paddingLeft } = sheetPadding;
	const totalWidth = labelWidth * columns + paddingLeft + paddingRight;
	const totalHeight = labelHeight * rows + paddingTop + paddingBottom;
	const exceeds = totalWidth > width || totalHeight > height;
	return { exceeds, totalWidth, totalHeight };
};

export const useLabelSpecSpacing = () => {
	const {scale} = useScale();
	const {
		scaled: { top, bottom, left, right },
	} = useSheetPadding();
	const {
		scaled: { width, height },
	} = useSheetDims();
	const { rows, columns, labelWidth, labelHeight } = useTemplateSelector((state) => state.sheet.labelSpecs);
	const { unit, convertForClient, convertForStorage } = useUnit();
	const safeSize = useMemo(
		() =>
			exceedsSheet({
				sheetPadding: { paddingTop: top, paddingRight: right, paddingBottom: bottom, paddingLeft: left },
				rows,
				columns,
				sheetDim: { width, height },
				labelDims: { width: labelWidth, height: labelHeight },
			}),
		[top, right, bottom, left, rows, columns, width, height, labelWidth, labelHeight],
	);
	const dispatch = useTemplateDispatch();
	const updateRows = useCallback(
		(rows: number) => {
			const min = 1;
			const max = 100;
			const newRows = Math.min(max, Math.max(min, rows));
			dispatch(updateLabelSpecs({ rows: newRows }));
		},
		[dispatch],
	);

	const updateColumns = useCallback(
		(columns: number) => {
			const min = 1;
			const max = 100;
			const newColumns = Math.min(max, Math.max(min, columns));
			dispatch(updateLabelSpecs({ columns: newColumns }));
		},
		[dispatch],
	);

	const updateLabelWidth = useCallback(
		(labelWidth: number) => {
			labelWidth = convertForStorage(labelWidth);
			const min = 0;
			const max = 1000;
			const newLabelWidth = Math.min(max, Math.max(min, labelWidth));
			dispatch(updateLabelSpecs({ labelWidth: newLabelWidth }));
		},
		[dispatch, convertForStorage],
	);

	const updateLabelHeight = useCallback(
		(labelHeight: number) => {
			labelHeight = convertForStorage(labelHeight);
			const min = 0;
			const max = 1000;
			const newLabelHeight = Math.min(max, Math.max(min, labelHeight));
			dispatch(updateLabelSpecs({ labelHeight: newLabelHeight }));
		},
		[dispatch, convertForStorage],
	);

	return {
		rows,
		columns,
		labelWidth: convertForClient(labelWidth),
		labelHeight: convertForClient(labelHeight),
		scaled: {
			labelWidth: convertForClient(labelWidth * scale),
			labelHeight: convertForClient(labelHeight * scale),
		},
		unit,
		updateRows,
		updateColumns,
		updateLabelWidth,
		updateLabelHeight,
		safeDim: safeSize,
	};
};

export const useLabelSpecPadding = () => {
	const { paddingTop, paddingRight, paddingBottom, paddingLeft } = useTemplateSelector(
		(state) => state.sheet.labelSpecs.padding,
	);
	const { unit, convertForClient, convertForStorage } = useUnit();
	const dispatch = useTemplateDispatch();
	const updatePadding = useCallback(
		(padding: Partial<Padding>) => {
			const convertedPadding: Partial<Padding> = {};
			if (padding.paddingTop) {
				convertedPadding.paddingTop = convertForStorage(padding.paddingTop);
			}
			if (padding.paddingRight) {
				convertedPadding.paddingRight = convertForStorage(padding.paddingRight);
			}
			if (padding.paddingBottom) {
				convertedPadding.paddingBottom = convertForStorage(padding.paddingBottom);
			}
			if (padding.paddingLeft) {
				convertedPadding.paddingLeft = convertForStorage(padding.paddingLeft);
			}
			dispatch(updateLabelPadding(convertedPadding));
		},
		[dispatch, convertForStorage],
	);

	return {
		paddingTop: convertForClient(paddingTop),
		paddingRight: convertForClient(paddingRight),
		paddingBottom: convertForClient(paddingBottom),
		paddingLeft: convertForClient(paddingLeft),
		updatePadding,
		unit,
	};
};

export const useLabelSpecBorder = () => {
	const { borderWidth, borderColor, borderStyle, borderRadius } = useTemplateSelector(
		(state) => state.sheet.labelSpecs.border,
	);
	const dispatch = useTemplateDispatch();
	const updateBorder = useCallback(
		(border: Partial<Border>) => {
			dispatch(updateLabelBorder(border));
		},
		[dispatch],
	);

	return {
		borderWidth,
		borderColor,
		borderStyle,
		borderRadius,
		updateBorder,
	};
};
