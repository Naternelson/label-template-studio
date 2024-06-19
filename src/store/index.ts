import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import sheet from './sheet';
import global from './global';

export const store = configureStore({
	reducer: combineReducers({
		sheet,
        global
	}),
});
export type RootTemplateState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useTemplateDispatch = useDispatch.withTypes<AppDispatch>();
export const useTemplateSelector = useSelector.withTypes<RootTemplateState>();
