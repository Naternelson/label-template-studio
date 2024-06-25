import { createSlice } from "@reduxjs/toolkit";

export type Unit = "in" | "cm" | "mm";
export type Mode = "select" | "text";

export type GlobalState = {
    loading: boolean; 
    error: string | null;
    name: string; 
    unit: Unit;
    mode: Mode;
}

const initialState: GlobalState = {
    loading: false,
    error: null,
    name: "Untitled",
    unit: "in",
    mode: "select"
}

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setUnit: (state, action) => {
            state.unit = action.payload;
        },
        setMode: (state, action) => {
            state.mode = action.payload;
        },
        setState: (state, action) => {
            return action.payload;
        }
    }
})

export const { setLoading, setError, setName, setUnit, setMode } = globalSlice.actions;
export default globalSlice.reducer;