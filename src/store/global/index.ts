import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type GlobalState = {
    scale: number;
}

export const initialState: GlobalState = {
    scale: 1
}

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setScale: (state, action: PayloadAction<number>) => {
            state.scale = action.payload;
            if (state.scale < 0.1) {
				state.scale = 0.1;
			}
			if (state.scale > 5) {
				state.scale = 5;
			}
        },
        incrementScale: (state, action: PayloadAction<number>) => {
            state.scale += action.payload;
            if(state.scale < 0.1) {
                state.scale = 0.1;
            }
            if(state.scale > 5) {
                state.scale = 5;
            }
        },
    }
})
export const { setScale, incrementScale } = globalSlice.actions;

export default globalSlice.reducer;