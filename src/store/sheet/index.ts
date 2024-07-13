import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
	GroupableBase,
	LockableBackground,
	LockableDimensions,
	PayloadGroupableAction,
	StateWithHistory,
} from '../types';
import { addSnapshot, setLockedProperty, toggleLockedProperty, updateProperties } from '../utility';

export type SheetState = {
	dimensions: LockableDimensions;
	background: LockableBackground;
	count: number;
	index: number;
};

export const initialState: StateWithHistory<SheetState> = {
	dimensions: {
		width: { value: 6, locked: false },
		height: { value: 4, locked: false },
	},
	background: {
		printBackground: { value: false, locked: false },
		color: { value: '#ffffff', locked: false },
		imageUrl: { value: undefined, locked: false },
		roundness: { value: 0, locked: false },
	},
	count: 1,
	index: 0,
	past: [],
	future: [],
};

export const sheetSlice = createSlice({
	name: 'sheet',
	initialState,
	reducers: {
		updateSheet: (state, action: PayloadGroupableAction<SheetState>) => {
			const { groupId, ...sheet } = action.payload;
			addSnapshot(state, action.payload.groupId);
			return updateProperties(state, sheet);
		},
		updateSheetCount: (state, action: PayloadAction<GroupableBase<number>>) => {
			const { groupId, value } = action.payload;
			addSnapshot(state, groupId);
			state.count = value;
			// If the currentIndex is greater than the new count, set to the new count
			if (state.index >= value) {
				state.index = value - 1;
			}
			if (state.index < 0) {
				state.index = 0;
			}
		},
		updateSheetIndex: (state, action: PayloadAction<number>) => {
			const value = action.payload;
			state.index = value;
			if (state.index >= state.count) {
				state.index = state.count - 1;
			}
			if (state.index < 0) {
				state.index = 0;
			}
		},
		toggleSheetLocks: (state, action: PayloadAction<string>) => {
			const path = action.payload;
			toggleLockedProperty(state, path);
		},
        setSheetLocks: (state, action: PayloadAction<{path: string, value: boolean}>) => {
            const { path, value } = action.payload;
            setLockedProperty(state, path, value);
        }
	},
});

export const { updateSheet, updateSheetCount, updateSheetIndex, toggleSheetLocks, setSheetLocks } = sheetSlice.actions;

export default sheetSlice.reducer;
