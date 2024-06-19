import { useCallback } from 'react';
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
	const currentIndex = useTemplateSelector((state) => state.sheet.currentIndex);
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
	return { currentIndex, updateIndex };
};

export const useSheetDims = () => {
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
	};
};

export const useLabelSpecSpacing = () => {
	const { rows, columns, gutterX, gutterY } = useTemplateSelector((state) => state.sheet.labelSpecs);
	const { unit, convertForClient, convertForStorage } = useUnit();
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

	const updateGutterX = useCallback(
		(gutterX: number) => {
			gutterX = convertForStorage(gutterX);
			const min = 0;
			const max = 1000;
			const newGutterX = Math.min(max, Math.max(min, gutterX));
			dispatch(updateLabelSpecs({ gutterX: newGutterX }));
		},
		[dispatch, convertForStorage],
	);

	const updateGutterY = useCallback(
		(gutterY: number) => {
			gutterY = convertForStorage(gutterY);
			const min = 0;
			const max = 1000;
			const newGutterY = Math.min(max, Math.max(min, gutterY));
			dispatch(updateLabelSpecs({ gutterY: newGutterY }));
		},
		[dispatch, convertForStorage],
	);

	return {
		rows,
		columns,
		gutterX: convertForClient(gutterX),
		gutterY: convertForClient(gutterY),
		updateRows,
		updateColumns,
		updateGutterX,
		updateGutterY,
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
    const updateBorder = useCallback((border: Partial<Border>) => {
        dispatch(updateLabelBorder(border));
    }, [dispatch]);



    return {
        borderWidth,
        borderColor,
        borderStyle,
        borderRadius,
        updateBorder,
    };
}