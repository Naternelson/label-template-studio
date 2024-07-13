import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import sheetReducer from "./sheet"
import globalReducer from "./global"

export const store = configureStore({
    reducer: {
        sheet: sheetReducer,
        global: globalReducer
    }
});

export type RootTemplateState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useTemplateDispatch = useDispatch.withTypes<AppDispatch>();
export const useTemplateSelector = useSelector.withTypes<RootTemplateState>();