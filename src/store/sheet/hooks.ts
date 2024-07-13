import { useCallback } from 'react';
import { setSheetLocks, toggleSheetLocks, updateSheet, updateSheetCount } from '.';
import { useTemplateDispatch, useTemplateSelector } from '..';

/**
 *
 * SHEET DIMENSIONS HOOKS
 */

export const useSheetDimensions = () => {
	return useTemplateSelector((state) => state.sheet.dimensions);
};

export const useSheetDimensionsControls = () => {
	const dispatch = useTemplateDispatch();
	const dimensions = useSheetDimensions();
	const allDimensionsLocked = Object.values(dimensions).every((d) => d.locked);
	const toggleWidthLock = useCallback(() => {
		dispatch(toggleSheetLocks('dimensions.width'));
	}, [dispatch]);
	const toggleHeightLock = useCallback(() => {
		dispatch(toggleSheetLocks('dimensions.height'));
	}, [dispatch]);
	const toggleDimensionsLocks = useCallback(() => {
		if (allDimensionsLocked) {
			dispatch(setSheetLocks({ path: 'dimensions.width', value: false }));
			dispatch(setSheetLocks({ path: 'dimensions.height', value: false }));
		} else {
			dispatch(setSheetLocks({ path: 'dimensions.width', value: true }));
			dispatch(setSheetLocks({ path: 'dimensions.height', value: true }));
		}
	}, [dispatch, allDimensionsLocked]);

	const updateWidth = useCallback(
		(value: number, groupId?: string) => {
			if (dimensions.width.locked) return;
			dispatch(updateSheet({ dimensions: { width: { value: Number(value) } }, groupId }));
		},
		[dispatch, dimensions.width.locked],
	);

	const updateHeight = useCallback(
		(value: number, groupId?: string) => {
			if (dimensions.height.locked) return;
			dispatch(updateSheet({ dimensions: { height: { value: Number(value) } }, groupId }));
		},
		[dispatch, dimensions.height.locked],
	);

	const updateSheetDimensions = useCallback(
		(width: number, height: number, groupId?: string) => {
			dispatch(
				updateSheet({
					dimensions: { width: { value: Number(width) }, height: { value: Number(height) } },
					groupId,
				}),
			);
		},
		[dispatch],
	);

	return {
		dimensions,
		toggleWidthLock,
		toggleHeightLock,
		toggleDimensionsLocks,
		updateWidth,
		updateHeight,
		updateSheetDimensions,
	};
};

/**
 *
 * SHEET BACKGROUND HOOKS
 */

export const useSheetBackground = () => {
	return useTemplateSelector((state) => state.sheet.background);
};
export const useSheetBackgroundControls = () => {
	const dispatch = useTemplateDispatch();
	const background = useSheetBackground();
	const allBackgroundLocked = Object.values(background).every((b) => b.locked);
	const togglePrintBackgroundLock = useCallback(() => {
		dispatch(toggleSheetLocks('background.printBackground'));
	}, [dispatch]);
	const toggleColorLock = useCallback(() => {
		dispatch(toggleSheetLocks('background.color'));
	}, [dispatch]);
	const toggleImageUrlLock = useCallback(() => {
		dispatch(toggleSheetLocks('background.imageUrl'));
	}, [dispatch]);
	const toggleRoundnessLock = useCallback(() => {
		dispatch(toggleSheetLocks('background.roundness'));
	}, [dispatch]);
	const toggleBackgroundLocks = useCallback(() => {
		if (allBackgroundLocked) {
			dispatch(setSheetLocks({ path: 'background.printBackground', value: false }));
			dispatch(setSheetLocks({ path: 'background.color', value: false }));
			dispatch(setSheetLocks({ path: 'background.imageUrl', value: false }));
			dispatch(setSheetLocks({ path: 'background.roundness', value: false }));
		} else {
			dispatch(setSheetLocks({ path: 'background.printBackground', value: true }));
			dispatch(setSheetLocks({ path: 'background.color', value: true }));
			dispatch(setSheetLocks({ path: 'background.imageUrl', value: true }));
			dispatch(setSheetLocks({ path: 'background.roundness', value: true }));
		}
	}, [dispatch, allBackgroundLocked]);

	const updatePrintBackground = useCallback(
		(value: boolean, groupId?: string) => {
			if (background.printBackground.locked) return;
			dispatch(updateSheet({ background: { printBackground: { value } }, groupId }));
		},
		[dispatch, background.printBackground.locked],
	);

	const updateColor = useCallback(
		(value: string, groupId?: string) => {
			if (background.color.locked) return;
			dispatch(updateSheet({ background: { color: { value } }, groupId }));
		},
		[dispatch, background.color.locked],
	);

	const updateImageUrl = useCallback(
		(value: string, groupId?: string) => {
			if (background.imageUrl?.locked) return;
			dispatch(updateSheet({ background: { imageUrl: { value } }, groupId }));
		},
		[dispatch, background.imageUrl?.locked],
	);

	const updateRoundness = useCallback(
		(value: number, groupId?: string) => {
			if (background.roundness.locked) return;
			dispatch(updateSheet({ background: { roundness: { value } }, groupId }));
		},
		[dispatch, background.roundness.locked],
	);

	return {
		background,
		togglePrintBackgroundLock,
		toggleColorLock,
		toggleImageUrlLock,
		toggleRoundnessLock,
		toggleBackgroundLocks,
		updatePrintBackground,
		updateColor,
		updateImageUrl,
		updateRoundness,
	};
};
export const useSheetCount = () => {
	return useTemplateSelector((state) => state.sheet.count);
};

export const useSheetCountControls = () => {
	const dispatch = useTemplateDispatch();
	const count = useSheetCount();
	const updateCount = useCallback(
		(value: number, groupId?: string) => {
			dispatch(updateSheetCount({ value, groupId }));
		},
		[dispatch],
	);

	const incrementCount = useCallback(
		(groupId?: string) => {
			updateCount(count + 1, groupId);
		},
		[count, updateCount],
	);

	const decrementCount = useCallback(
		(groupId?: string) => {
			if (count <= 1) return;
			updateCount(count - 1, groupId);
		},
		[count, updateCount],
	);

	return { count, updateCount, incrementCount, decrementCount };
};

export const useSheetIndex = () => {
	return useTemplateSelector((state) => state.sheet.index);
};

export const useSheetIndexControls = () => {
    const dispatch = useTemplateDispatch();
    const index = useSheetIndex();
    const updateIndex = useCallback(
        (value: number) => {
            dispatch(updateSheetCount({ value }));
        },
        [dispatch],
    );

    const incrementIndex = useCallback(() => {
        updateIndex(index + 1);
    }, [index, updateIndex]);

    const decrementIndex = useCallback(() => {
        if (index <= 0) return;
        updateIndex(index - 1);
    }, [index, updateIndex]);

    return { index, updateIndex, incrementIndex, decrementIndex };
}
