import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { Provider } from 'react-redux';
import { store } from './store';
import { globalStyles } from './globalStyles';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { GamepadProvider } from './components';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<CssBaseline />
		<ThemeProvider theme={theme}>
			{globalStyles}
			<Provider store={store}>
				<GamepadProvider>
					<RouterProvider router={router} />
				</GamepadProvider>
			</Provider>
		</ThemeProvider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
